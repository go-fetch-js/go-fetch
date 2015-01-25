var httprequest   = require('no-frills-request');
var emitter       = require('emitter-on-steroids');
var Request       = require('./Request');
var Response      = require('./Response');
var Stream        = require('./Stream');

//TODO: move the URL to another package, don't return the response, only require a callback - simpler!

/**
 * A HTTP client
 * @constructor
 * @extends emitter
 * @param   {Object}    options
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
  this.options = options;
}
emitter(Client.prototype);

/**
 * The plugins
 * @type {Object}
 */
Client.plugins = require('./plugins');

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
  self.emit('before', request, response, function(err) {
    if (err) request.emit('error', err);

    //create the request
    var req = httprequest.create(
      request.getMethod(),
      request.getUrl().toString(),
      request.getHeaders(),
      self.options
    );

    //notify the user when the request has been sent to the server
    req.on('finish', function() {
      request.emit('sent'); //TODO: forward to the client too
    });

    //notify the user when an error occurred whilst sending the request
    req.on('error', function(err) {
      request.emit('error', err); //TODO: forward to the client too
    });

    //wrap the response and notify the user when the response has been received
    req.on('response', function(res) {

      //listen for errors
      res.on('error', function(err) {
        response.emit('error', err); //TODO: forward to the client too
      });

      //set the response properties
      response
        .setStatus(res.statusCode)
        .setHeaders(res.headers)
        .setBody(new Stream(res))
      ;

      //allow the plugins to do stuff before the request is sent
      self.emit('after', request, response, function(err) {
        if (err) response.emit('error', err);

        //tell the user the response has been received from the server
        response.emit('received'); //TODO: forward to the client too

      });

    });

    //send the request
    req.send(request.getBody());

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