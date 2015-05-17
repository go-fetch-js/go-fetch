var util          = require('util');
var httprequest   = require('no-frills-request');
var emitter       = require('emitter-on-steroids');
var Url           = require('./Url');
var Request       = require('./Request');
var Response      = require('./Response');
var Stream        = require('./Stream');
var SteroidEvent  = require('emitter-on-steroids/event');

/**
 * Event
 * @constructor
 * @param   {Object}    options
 * @param   {Object}    options.name
 * @param   {Request}   options.request
 * @param   {Response}  options.response
 * @param   {Object}    [options.emitter]
 */
function Event(options) {
  SteroidEvent.call(this, options.name, options.emitter);
  this.request  = options.request;
  this.response = options.response;
}
util.inherits(Event, SteroidEvent);
Event.stoppable = SteroidEvent.stoppable;
Event.preventable = SteroidEvent.preventable;

//TODO: move the URL to another package, don't return the response, only require a callback - simpler!

/**
 * A HTTP client
 * @constructor
 * @extends emitter
 * @param   {Object}    options
 * @param   {number}    [options.timeout]
 * @param   {string}    [options.https_protocol]
 * @param   {boolean}   [options.https_ignore_errors]
 * @returns {Client}
 */
function Client(options) {

  if (!(this instanceof Client)) {
    return new Client(options);
  }

  emitter.call(this);

  /**
   * @private
   * @type {{https_protocol?: string, https_ignore_errors?: boolean}}
   */
  this.options = options || {};
}
emitter(Client.prototype);

Client.Url      = Url;
Client.Request  = Request;
Client.Response = Response;
Client.Event    = Event;

/**
 * Apply a plugin
 * @param   {function(Client)} plugin
 * @returns {Client}
 */
Client.prototype.use = function(plugin) {
  plugin(this);
  return this;
};

/**
 * Send a request
 * @param   {Request}                     request     The request
 * @param   {function(Error, Response)}   [callback]  A callback - called when the response is received or there is an error sending the request or receiving the response
 * @returns {Response}
 */
Client.prototype.send = function(request, callback) {
  var self = this;

  //create a new response
  var response = new Response();

  //forward events to the client
  request
    .on('sent', function() {
      self.emit('sent', this);
    })
    .on('error', function(error) {
      self.emit('error', error);
    })
  ;

  //forward events to the client
  response
    .on('received', function() {
      self.emit('received', this);
    })
    .on('error', function(error) {
      self.emit('error', error);
    })
  ;

  //register a callback
  if (callback) {

    //assert callback is a function
    if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function');
    }

    //notify callback of request errors
    request.on('error', function(error) {
      callback(error);
    });

    //notify callback of response errors
    response.on('error', function(error) {
      callback(error);
    });

    //notify callback that the response has been received
    response.on('received', function() {
      callback(undefined, this);
    });

  }

  //allow the plugins to do stuff before the request is sent
  var beforeEvent = Event.stoppable(Event.preventable(new Event({
    name:     'before',
    request:  request,
    response: response,
    emitter:  this
  })));
  this.emit(beforeEvent, function(err, event) {
    if (err) return event.request.emit('error', err);

    if (event.isDefaultPrevented()) {

      event.request.emit('sent');

      //allow the plugins to do stuff after the response is received
      var event = Event.stoppable(new Event({
        name:     'after',
        request:  request,
        response: response,
        emitter:  this
      }));
      self.emit(event, function(err, event) {
        if (err) return response.emit('error', err);

        //tell the user the response has been received from the server
        event.response.emit('received');

      });

    } else {

      //create the request
      var req = httprequest.create(
        event.request.getMethod(),
        event.request.getUrl().toString(),
        event.request.getHeaders(),
        self.options
      );

      //set timeout
      if (self.options.timeout) {
        req.on('socket', function(socket) {
          socket.setTimeout(self.options.timeout, function() {
            req.abort();
          });
        });
      }

      //notify the user when the request has been sent to the server
      req.on('finish', function() {
        event.request.emit('sent');
      });

      //notify the user when an error occurred whilst sending the request
      req.on('error', function(err) {
        event.request.emit('error', err);
      });

      //wrap the response and notify the user when the response has been received
      req.on('response', function(res) {

        //listen for errors
        res.on('error', function(err) {
          response.emit('error', err);
        });

        //set the response properties
        event.response
          .setStatus(res.statusCode)
          .setHeaders(res.headers)
          .setBody(new Stream(res))
        ;

        //allow the plugins to do stuff after the response is received
        var afterEvent = Event.stoppable(Event.preventable(new Event({
          name:     'after',
          request:  event.request,
          response: event.response,
          emitter:  this
        })));
        self.emit(afterEvent, function(err, event) {
          if (err) return event.response.emit('error', err);

          //tell the user the response has been received from the server
          event.response.emit('received');

        });

      });

      //send the request
      req.send(event.request.getBody());

    }

  });

  if (callback) {
    return this;
  } else {
    return response;
  }
};

/**
 * Create a new request... and send it if a callback is provided
 * @param   {string}                      method
 * @param   {string}                      url
 * @param   {Object}                      [headers]
 * @param   {Object}                      [body]
 * @param   {function(Error, Response)}   [callback]
 * @returns {Client|Request}
 */
Client.prototype.request = function(method, url, headers, body, callback) {

  //figure out which optional arguments were provided
  if (arguments.length >= 3 && typeof(arguments[arguments.length-1]) === 'function') {

    //send the request and return the result to the callback
    if (arguments.length === 3) {
      callback  = headers;
      body      = undefined;
      headers   = {};
    } else if (arguments.length === 4) {
      callback  = body;
      body      = undefined;
    }

    if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function.');
    }

  }

  //create a new request
  var request = new Request();
  request
    .setMethod(method)
    .setUrl(url)
    .setHeaders(headers || {})
    .setBody(body)
  ;

  if (callback) {

    //send the request
    this.send(request, callback);

    return this;
  } else {

    var self = this;

    /**
     * Send the request
     * @returns {Response}
     */
    request.send = function() {
      return self.send(this);
    };

    return request;
  }

};

/**
 * Create a new GET request
 * @param   {string}                      url
 * @param   {Object}                      [headers]
 * @param   {function(Error, Response)}   [callback]
 * @returns {Client|Request}
 */
Client.prototype.get = function(url, headers, callback) {
  return this.request.apply(this, ['GET'].concat(Array.prototype.slice.call(arguments)));
};


/**
 * Create a new GET request
 * @param   {string}                      url
 * @param   {Object}                      [headers]
 * @param   {Object}                      [data]
 * @param   {function(Error, Response)}   [callback]
 * @returns {Client|Request}
 */
Client.prototype.post = function(url, headers, data, callback) {
  return this.request.apply(this, ['POST'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Create a new PUT request
 * @param   {string}                      url
 * @param   {Object}                      [headers]
 * @param   {Object}                      [data]
 * @param   {function(Error, Response)}   [callback]
 * @returns {Client}
 */
Client.prototype.put = function(url, headers, data, callback) {
  return this.request.apply(this, ['PUT'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Create a new DELETE request
 * @param   {string}                      url
 * @param   {Object}                      [headers]
 * @param   {Object}                      [data]
 * @param   {function(Error, Response)}   [callback]
 * @returns {Client}
 */
Client.prototype.delete = function(url, headers, data, callback) {
  return this.request.apply(this, ['DELETE'].concat(Array.prototype.slice.call(arguments)));
};

module.exports = Client;