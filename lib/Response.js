var util = require('util');
var emitter = require('emitter-on-steroids');

/**
 * A HTTP Response
 * @constructor
 */
function Response(){
  this._status  = null;
  this._headers = {};
  this._body;
};
emitter(Response.prototype);

/**
 * Get the status code
 * @returns {number}
 */
Response.prototype.getStatus = function() {
  return this._status;
};

/**
 * Set the status code
 * @param   {number} status
 * @returns {Response}
 */
Response.prototype.setStatus = function(status) {
  this._status = Number(status);
  return this;
};

/**
 * Get the headers
 * @returns {Object}
 */
Response.prototype.getHeaders = function() {
  return this._headers;
};

/**
 * Set the headers
 * @param   {Object} headers
 * @returns {Response}
 */
Response.prototype.setHeaders = function(headers) {
  this._headers = headers;
  return this;
};

/**
 * Get a header
 * @param   {string} name
 * @param   {string} defaultValue
 * @returns {Object}
 */
Response.prototype.getHeader = function(name, defaultValue) {
  return this._headers[name.toLowerCase()] || defaultValue;
};

/**
 * Set a header
 * @param   {string} name
 * @param   {string} value
 * @returns {Response}
 */
Response.prototype.setHeader = function(name, value) {
  this._headers[name.toLowerCase()] = value;
  return this;
};

/**
 * Get the body
 * @returns {string|Buffer|Readable}
 */
Response.prototype.getBody = function() {
  return this._body;
};

/**
 * Set the body
 * @param   {string|Buffer|Readable} body
 * @returns {Response}
 */
Response.prototype.setBody = function(body) {
  this._body = body;
  return this;
};

module.exports = Response;