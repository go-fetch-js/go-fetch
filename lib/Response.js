var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * A response
 * @constructor
 */
function Response(){
  this._response  = undefined;
  this._emitter   = new EventEmitter();
  this._events    = [];
  this._fnToCallOnInject = {};
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

  /*
   * We add events to both emitters in case the user emits an event (which uses the ._emitter because we can't fire events on a stream) or in case where the response object doesn't exist and the client emits the error event (which uses the ._emitter event because the ._response may not won't exist)
   */

  this._emitter.on(event, callback.bind(this));

  if (this._response) {
    this._response.on(event, callback.bind(this));
  } else {
    this._events.push([event, callback.bind(this)]); //listen for the event when the response instance is injected

  }
  return this;
};

Response.prototype.end = function() {
  this._response.socket.end();
  return this;
};

Response.prototype.resume = function() {
  if (this._response) {
    this._response.resume();
  } else {
    this._fnToCallOnInject.resume = [];
  }
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

  if (response !== undefined) {

    //store the response
    this._response = response;

    //register events that were registered before the response was injected
    while (this._events.length>0) {
      var meta = this._events.shift();
      this._response.on(meta[0], meta[1]);
    }

    //call the events the user has already called when the response is injected
    for (var prop in this._fnToCallOnInject) {
      if (this._fnToCallOnInject.hasOwnProperty(prop)) {
        this._response[prop].apply(this._response, this._fnToCallOnInject[prop]);
      }
    }

  }

  return this;
};

module.exports = Response;