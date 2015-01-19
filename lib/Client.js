var http      = require('no-frills-request');
var emitter   = require('emitter-on-steroids');
var Request   = require('./Request');
var Response  = require('./Response');

/**
 * A HTTP client
 * @constructor
 * @param   {Object}    options
 * @param   {String}    [options.https_protocol]
 * @param   {Boolean}   [options.https_ignore_errors]
 */
function Client(options) {

  if (!(this instanceof Client)) {
    return new Client(options);
  }

  emitter.call(this);

  this.options = options;
}
emitter(Client.prototype);

/**
 * The plugins
 * @type {exports}
 */
Client.plugins = require('./plugins');

/**
 * Apply a plugin
 * @param   {Object} plugin
 * @returns {Client}
 */
Client.prototype.use = function(plugin) {
  plugin(this);
  return this;
};

/**
 * Send a request
 * @param   {Request} request
 * @returns {Response}
 */
Client.prototype.send = function(request) {

  var
    self      = this,
    response  = new Response()
  ;

  //allow the plugins to do stuff before the request is sent
  self.emit('before', request, response, function(err) {
    //TODO: handle plugin errors?

    http(
      request.method(),
      request.url(),
      {
        headers:  request.headers(),
        data:     request.body(),
        agent:    this.options
      },
      function(err, res) {

        //check for an error
        if (err) {
          return response._emitter.emit('error', err);
        }

        //inject the response object
        response._inject(res);

        //allow the plugins to do stuff before the request is sent
        self.emit('after', request, response, function(err) {
          //TODO: handle plugin errors?

          //tell the user the headers are ready for consuming
          response._emitter.emit('headers');

        });

      }
    );


  });

  return response;
};

/**
 *
 * Create a new request OOP style
 * @signature `.request(method, url, headers)`
 * @param   {String}    method
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @param   {Object}    [data]
 * @returns {Request}
 *
 * Create a new request nodejs style
 * @signature `.request(method, url, headers, callback)`
 * @param   {String}    method
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @param   {Object}    [data]
 * @param   {Function}  callback
 * @returns {Client}
 *
 */
Client.prototype.request = function(method, url, headers, data, callback) {

  if (arguments.length >= 3 && typeof(arguments[arguments.length-1]) === 'function') {

    //send the request and return the result to the callback

    if (arguments.length === 3) {
      callback  = headers;
      data      = undefined;
      headers   = {};
    } else if (arguments.length === 4) {
      callback  = data;
      data      = undefined;
      headers   = {};
    }

    if (typeof(callback) !== 'function') {
      throw new Error('Callback must be a function.');
    }

    var response = this.request(method, url, headers, data).send()
      .on('error', function(error) {
        callback(error);
      })
      .on('headers', function() {
        callback(undefined, this);
      })
    ;

    return this;

  } else {

    //return the request for further processing

    var
      self    = this,
      request = new Request(method, url, headers, data)
    ;

    request.send = function() {
      return self.send(this);
    };

    return request;

  }

};

/**
 *
 * Create a new GET request OOP style
 * @signature `.request(url, headers)`
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @returns {Request}
 *
 * Create a new GET request nodejs style
 * @signature `.request(url, headers, callback)`
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @param   {Function}  callback
 * @returns {Client}
 *
 */
Client.prototype.get = function(url, headers, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('GET');
  return this.request.apply(this, args);
};

/**
 *
 * Create a new POST request OOP style
 * @signature `.request(url, headers, data)`
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @param   {Object}    [data]
 * @returns {Request}
 *
 * Create a new POST request nodejs style
 * @signature `.request(url, headers, data, callback)`
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @param   {Object}    [data]
 * @param   {Function}  callback
 * @returns {Client}
 *
 */
Client.prototype.post = function(url, headers, data, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('POST');
  return this.request.apply(this, args);
};

/**
 *
 * Create a new PUT request OOP style
 * @signature `.request(url, headers, data, callback)`
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @param   {Object}    [data]
 * @returns {Request}
 *
 * Create a new PUT request nodejs style
 * @signature `.request(url, headers, data, callback)`
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @param   {Object}    [data]
 * @param   {Function}  callback
 * @returns {Client}
 *
 */
Client.prototype.put = function(url, headers, data, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('PUT');
  return this.request.apply(this, args);
};

/**
 *
 * Create a new DELETE request OOP style
 * @signature `.request(url, headers, data)`
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @param   {Object}    [data]
 * @returns {Request}
 *
 * Create a new DELETE request nodejs style
 * @signature `.request(url, headers, data, callback)`
 * @param   {String}    url
 * @param   {Object}    [headers]
 * @param   {Object}    [data]
 * @param   {Function}  callback
 * @returns {Client}
 *
 */
Client.prototype.delete = function(url, headers, data, callback) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('DELETE');
  return this.request.apply(this, args);
};

module.exports = Client;