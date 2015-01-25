var Url = require('./Url');
var emitter = require('emitter-on-steroids');

/**
 * A HTTP Request
 * @constructor
 * @param   {string}                method
 * @param   {string}                url
 * @param   {string}                headers
 * @param   {string|Buffer|Stream}  body
 */
function Request(method, url, headers, body) {
  this
    .setMethod(method || '')
    .setUrl(url || '')
    .setHeaders(headers || {})
    .setBody(body)
  ;
}
emitter(Request.prototype);

/**
 * Get the method
 * @returns {string}
 */
Request.prototype.getMethod = function() {
  return this._method;
};

/**
 * Set the method
 * @param   {string} method
 * @returns {Request}
 */
Request.prototype.setMethod = function(method) {
  this._method = String(method).toUpperCase();
  return this;
};

/**
 * Get the URL
 * @returns {Url}
 */
Request.prototype.getUrl = function() {
  return this._url;
};

/**
 * Set the URL
 * @param   {string|Url} url
 * @returns {Request}
 */
Request.prototype.setUrl = function(url) {
  this._url = new Url(String(url));
  return this;
};

/**
 * Get the headers
 * @returns {Object}
 */
Request.prototype.getHeaders = function() {
  return this._headers;
};

/**
 * Set the headers
 * @param   {Object} headers
 * @returns {Request}
 */
Request.prototype.setHeaders = function(headers) {
  this._headers = headers;
  return this;
};

/**
 * Get a header
 * @param   {string} name
 * @param   {string} defaultValue
 * @returns {Object}
 */
Request.prototype.getHeader = function(name, defaultValue) {
  return this._headers[String(name)] || String(defaultValue);
};

/**
 * Set a header
 * @param   {string} name
 * @param   {string} value
 * @returns {Request}
 */
Request.prototype.setHeader = function(name, value) {
  this._headers[String(name)] = String(value);
  return this;
};

/**
 * Get the body
 * @returns {string|Buffer|Readable}
 */
Request.prototype.getBody = function() {
  return this._body;
};

/**
 * Set the body
 * @param   {string|Buffer|Readable} body
 * @returns {Request}
 */
Request.prototype.setBody = function(body) {
  this._body = body;
  return this;
};

/**
 * Return the request as a string
 * @returns {string}
 */
Request.prototype.toString = function() {

  var headers = '';
  for (var name in this._headers) {
    if (this._headers.hasOwnProperty(name)) {
      headers += name+': '+this._headers[name]+'\r\n';
    }
  }

  var output =
    this.getMethod()+' '+this.getUrl().getPathAndQuery()+' HTTP/1.1\r\n'+
    'Host: '+this.getUrl().getHost()+'\r\n'+
    headers+
    '\r\n'+
    this.getBody().toString()+'\r\n'
  ;

  return output;
};

module.exports = Request;