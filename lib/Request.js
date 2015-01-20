
/**
 * A request
 * @constructor
 * @param   {string}    method
 * @param   {string}    url
 * @param   {Object}    headers
 * @param   {string}    body
 */
function Request(method, url, headers, body) {
  this._method  = method;
  this._url     = url;
  this._headers = headers || {};
  this._body    = body;
}

/**
 * Get the method
 * @returns {string}
 */
Request.prototype.method = function() {
  return this._method;
};

/**
 *
 * Get the URL
 * @signature `request.get()`
 * @returns {string}
 *
 * Set the URL
 * @signature `request.set(url)`
 * @param   {string} url
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
 * @param   {string}  name
 * @param   {string}  [value]
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
 * @param   {string}  data
 * @returns {Request|string}
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