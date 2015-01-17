
/**
 * A request
 * @constructor
 * @param   {String}    method
 * @param   {String}    url
 * @param   {Object}    headers
 * @param   {String}    data
 */
function Request(method, url, headers, data) {
  this._method  = method;
  this._url     = url;
  this._headers = headers || {};
  this._data    = data;
}

/**
 * Get the method
 * @returns {String}
 */
Request.prototype.method = function() {
  return this._method;
};

/**
 * Get the URL
 * @returns {String}
 */
Request.prototype.url = function() {
  return this._url;
};

/**
 * Get all headers
 * @returns {Object}
 */
Request.prototype.headers = function() {
  return this._headers;
};

/**
 * Get/set a header
 * @param   {String}  name
 * @param   {String}  [value]
 * @returns {Request|String}
 */
Request.prototype.header = function(name, value) {
  if (arguments.length === 2) {
    this._headers[name] = value;
    return this;
  } else {
    return this._header[name];
  }
};

/**
 * Get/set the body content
 * @param   {String}  data
 * @returns {Request|String}
 */
Request.prototype.body = function(data) {
  if (arguments.length > 0) {
    this._data = data;
    return this;
  } else {
    return this._data;
  }
};

module.exports = Request;