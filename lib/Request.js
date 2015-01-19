
/**
 * A request
 * @constructor
 * @param   {String}    method
 * @param   {String}    url
 * @param   {Object}    headers
 * @param   {String}    body
 */
function Request(method, url, headers, body) {
  this._method  = method;
  this._url     = url;
  this._headers = headers || {};
  this._body    = body;
}

/**
 * Get the method
 * @returns {String}
 */
Request.prototype.method = function() {
  return this._method;
};

/**
 *
 * Get the URL
 * @signature `request.get()`
 * @returns {String}
 *
 * Set the URL
 * @signature `request.set(url)`
 * @param   {String} url
 * @returns {Request}
 *
 */
Request.prototype.url = function(url) {
  if (arguments.length === 0) {
    return this._url;
  } else {
    this._url = url;
    return this;
  }
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
    return this._headers[name];
  }
};

/**
 * Get/set the body content
 * @param   {String}  data
 * @returns {Request|String}
 */
Request.prototype.body = function(data) {
  if (arguments.length > 0) {
    this._body = data;
    return this;
  } else {
    return this._body;
  }
};

module.exports = Request;