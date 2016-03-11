'use strict';

/**
 * A HTTP Response
 * @class
 */
class Response {

  /**
   * Create a response
   * @param   {object}    options
   * @param   {string}    options.version
   * @param   {number}    options.status
   * @param   {string}    options.reason
   * @param   {string}    options.headers
   * @param   {*|Stream}  options.body
   */
  constructor(options) {
    options = options || {};
    this.version = options.version || '1.1';
    this.status = options.status || 0;
    this.reason = options.reason || '';
    this.headers = options.headers || {};
    this.body = options.body || null;
  }

  /**
   * Read the text
   * @param   {string} encoding
   * @returns {Promise}
   */
  text(encoding) {
    return new Promise((resolve, reject) => {
      let text = '';

      this.on(
        'data',
        buffer => text += buffer.toString(encoding)
      );

      this.on('end', () => {
        //TODO: cleanup event handlers
        resolve(text);
      });

      //TODO: handle errors

    });
  }

  /**
   * Represent the response as a string
   * @returns {string}
   */
  toString() {
    return [
      `HTTP/${this.version} ${this.status} ${this.reason}\r\n`,
      Object.keys(this.headers).map(name => `${name}: ${this.headers[name]}\r\n`).join(''),
      '\r\n',
      String(this.body || '')
    ].join('');
  }

}

module.exports = Response;