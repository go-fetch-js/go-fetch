var qs = require('qs');
var URL = require('url');

/**
 * A URL
 * @constructor
 * @param   {string|Url} url
 */
function Url(url) {
	this._parts = URL.parse(String(url), true);
}

/**
 * Get the protocol
 * @returns {string}
 */
Url.prototype.getProtocol = function() {
	return this._parts.protocol;
};

/**
 * Get the username
 * @returns {string}
 */
Url.prototype.getUsername = function() {
	return this._parts.auth ? this._parts.auth.split(':')[0] : '';
};

/**
 * Get the password
 * @returns {string}
 */
Url.prototype.getPassword = function() {
	return this._parts.auth ? this._parts.auth.split(':')[1] : '';
};

/**
 * Get the host
 * @returns {string}
 */
Url.prototype.getHost = function() {
	return this._parts.host;
};

/**
 * Get the port
 * @returns {number}
 */
Url.prototype.getPort = function() {
	return Number(this._parts.port);
};

/**
 * Get the path
 * @returns {string}
 */
Url.prototype.getPath = function() {
	return this._parts.pathname;
};

/**
 * Get the path and query string together
 * @returns {string}
 */
Url.prototype.getPathAndQuery = function() {
	return this._parts.path;
};

/**
 * Get the query values
 * @param   {string} [name]           The query string name
 * @param   {string} [defaultValue]   The default query string value
 * @returns {string}
 */
Url.prototype.getQuery = function(name, defaultValue) {
	if (arguments.length === 0) {
		return this._parts.query;
	} else {
		return this._parts.query[String(name)] || defaultValue;
	}
};

/**
 * Set the query values
 * @param   {string} [name]   The query string name
 * @param   {string} [value]  The query string value
 * @returns {string}
 */
Url.prototype.setQuery = function(name, value) {
	if (arguments.length === 2) {
		this._parts.query[String(name)] = String(value);
	} else {
		this._parts.query = name;
	}
	return this;
};

/**
 * Get the fragment
 * @returns {string}
 */
Url.prototype.getFragment = function() {
	return this._parts.hash;
};

/**
 * Return the URL as a string
 * @returns {string}
 */
Url.prototype.toString = function() {
	var spec = {
		protocol: this._parts.protocol,
		auth:     this._parts.auth,
		host:     this._parts.host,
		port:     this._parts.port,
		pathname: this._parts.pathname,
    search:   qs.stringify(this._parts.query),
		hash:     this._parts.hash
	};
	return URL.format(spec);
};

module.exports = Url;