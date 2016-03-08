'use strict';
const url = require('url');

/**
 * A HTTP Request
 * @class
 */
class Request {

  /**
   * Create a request
   * @param   {object}  options
   * @param   {string}  options.method
   * @param   {string}  options.url
   * @param   {object}  options.headers
   * @param   {*}       options.body
   */
  constructor(options) {
    options = options || {};
    this.version = '1.1';
    this.method = options.method && options.method.toUpperCase() || '';
    this.url = options.url || ''; //TODO: convert URL object to a string with fancy qs
    this.headers = options.headers || {};
    this.body = options.body || null;
  }

  /**
   * Return the request as a string
   * @returns {string}
   */
  toString() {
    const parsedUrl = url.parse(this.url);
    return [
      `${this.method} ${parsedUrl.path} HTTP/${this.version}\r\n`,
      `host: ${parsedUrl.host}\r\n`,
      Object.keys(this.headers).map(name => `${name}: ${this.headers[name]}\r\n`).join(''),
      '\r\n',
      String(this.body || '')
    ].join('');
  }

}

module.exports = Request;