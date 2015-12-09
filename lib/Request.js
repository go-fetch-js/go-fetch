'use strict';

const url = require('url');

/**
 * A HTTP Request
 * @constructor
 * @param   {string}                method
 * @param   {string}                url
 * @param   {string}                headers
 * @param   {string|Buffer|Stream}  body
 */
class Request {

  constructor(options) {
    if (options) {
      this.method = options.method || '';
      this.url = options.url || '';
      this.headers = options.headers || {};
      this.body = options.body || null;
    }
  }

  get method() {
    return this._method;
  }

  set method(value) {
    return this._method = value;
  }

  get url() {
    return this._url;
  }

  set url(value) {
    return this._url = value;
  }

  get headers() {
    return this._headers;
  }

  set headers(value) {
    return this._headers = value;
  }

  get body() {
    return this._body;
  }

  set body(value) {
    return this._body = value;
  }

  /**
   * Return the request as a string
   * @returns {string}
   */
  toString() {

    let headerLines = '';
    for (var name in this.headers) {
      if (this.headers.hasOwnProperty(name)) {
        headerLines += name + ': ' + this.headers[name] + '\r\n';
      }
    }

    const parsedUrl = url.parse(this.url);
    const lines =
        this.method + ' ' + parsedUrl.path + ' HTTP/1.1\r\n' +
        'Host: ' + parsedUrl.host + '\r\n' +
        headerLines +
        '\r\n' +
        (this.body && !this.body.toString ? '<Unable to render body as a string>' :  this.body || '')
      ;

    return lines;
  }

}

module.exports = Request;