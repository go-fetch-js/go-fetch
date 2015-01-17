var util = require('util');
var EventEmitter = require('events').EventEmitter;

var stream_events = ['readable', 'data', 'end', 'close', 'error'];

/**
 * A response
 * @constructor
 */
function Response(){
  this._response  = undefined;
  this._emitter   = new EventEmitter();
  this._events    = [];
};

/**
 * Get the status code
 * @returns {Number}
 */
Response.prototype.status = function() {
  return this._response.statusCode;
};

/**
 * Get all headers
 * @returns {Object}
 */
Response.prototype.headers = function() {
  return this._response.headers;
};

/**
 * Get/set a header
 * @param   {String}  name      The header name
 * @param   {String}  [value]
 * @returns {Response|String}
 */
Response.prototype.header = function(name, value) {
  name = name.toLowerCase();
  if (arguments.length === 2) {
    this._response.headers[name] = value;
    return this;
  } else {
    return this._response.headers[name];
  }
};

/**
 * Attach an event handler
 * @param   {String}    event
 * @param   {Function}  callback
 * @returns {Response}
 */
Response.prototype.on = function(event, callback) {
  if (stream_events.indexOf(event) === -1) {
    this._emitter.on(event, callback.bind(this));
  } else {
    if (this._response) { //the response might not have been injected yet
      this._response.on(event, callback.bind(this));
    } else {
      this._events.push([event, callback.bind(this)]);
    }
  }
  return this;
};

Response.prototype.end = function() {
  this._response.socket.end();
  return this;
};

Response.prototype.destroy = function() {
  this._response.socket.destroy();
  return this;
};

/**
 * Inject the response object
 * @private
 * @param   {http.IncommingMessage} response
 * @returns {Response}
 */
Response.prototype._inject = function(response) {

  //store the response
  this._response = response;

  //register events that were registered before the response was injected
  while (this._events.length>0) {
    var meta = this._events.shift();
    this._response.on(meta[0], meta[1]);
  }

  return this;
};

module.exports = Response;