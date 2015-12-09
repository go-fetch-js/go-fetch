'use strict';

/**
 * A HTTP Request
 * @constructor
 * @param   {string}                method
 * @param   {string}                url
 * @param   {string}                headers
 * @param   {string|Buffer|Stream}  body
 */
class Response {

  constructor(options) {
    if (options) {
      this.status = options.status || '';
      this.reason = options.reason || '';
      this.headers = options.headers || {};
      this.body = options.body || {};
    }
  }

  get status() {
    return this._status;
  }

  set status(value) {
    return this._status = value;
  }

  get reason() {
    return this._reason;
  }

  set reason(value) {
    return this._reason = value;
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

    let lines =
        'HTTP/1.1 ' + this.status + ' ' + this.reason + '\r\n' +
        headerLines +
        '\r\n' +
        (this.body && !this.body.toString ? '<Unable to render body as a string>' :  this.body || '')
      ;

    return lines;
  }

}

module.exports = Response;