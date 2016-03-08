'use strict';
const ware = require('ware');
const request = require('no-frills-request');
const Request = require('./Request');
const Response = require('./Response');
const Stream = require('./Stream');

/**
 * A HTTP client
 * @class
 */
class Client {

  /**
   * Construct the HTTP client
   * @constructor
   * @param   {object} options
   */
  constructor(options) {
    this._before = ware();
    this._after = ware();
  }

  /**
   * Register a middleware function that runs before a request is sent
   * @param   {function} ware
   * @returns {Client}
   */
  before(ware) {
    this._before.use(ware);
    return this;
  }

  /**
   * Register a middleware function that runs after a response is received
   * @param   {function} ware
   * @returns {Client}
   */
  after(ware) {
    this._after.use(ware);
    return this;
  }

  /**
   * Register a plugin
   * @param   {function} plugin
   * @returns {Client}
   */
  use(plugin) {
    plugin(this);
    return this;
  }

  /**
   * Perform a HTTP request
   * @param   {string}  method
   * @param   {string}  url
   * @param   {object}  [headers]
   * @param   {*}       [body]
   * @returns {Promise}
   */
  request(method, url, headers, body) {
    return new Promise((resolve, reject) => {

      //wrap the request
      const wrappedRequest = new Request({
        method, url, headers, body
      });

      //run the middleware allowing changes to the request
      this._before.run(wrappedRequest, (beforeError, alteredRequest) => {
        if (beforeError) return reject(beforeError);

        //TODO: investigate a way of cancelling the request and returning a static response? e.g. for caching middleware

        //check the request has at least a method and a URL set
        if (!alteredRequest.method) return reject(new Error('go-fetch: Request method is required.'));
        if (!alteredRequest.url) return reject(new Error('go-fetch: go-fetch: Request URL is required.'));

        //perform the request
        request(
          alteredRequest.method,
          alteredRequest.url,
          {
            headers: alteredRequest.headers,
            body: alteredRequest.body
          },
          (requestError, res) => {
            if (requestError) return reject(requestError);

            //wrap the response
            const wrappedResponse = new Response({
              version: res.httpVersion,
              status: res.statusCode,
              reason: res.statusMessage,
              headers: res.headers,
              body: new Stream(res)
            });

            //run the middleware allowing changes to the response
            this._after.run(wrappedResponse, (afterError, alteredResponse) => {
              if (afterError) return reject(afterError);
              return resolve(alteredResponse);
            });

          }
        );

      });

    });
  }

  /**
   * Perform a GET request
   * @param   {string}  url
   * @param   {object}  [headers]
   * @returns {Promise}
   */
  get(url, headers) {
    return this.request('GET', url, headers);
  }

  /**
   * Perform a POST request
   * @param   {string}  url
   * @param   {object}  [headers]
   * @param   {*}       body
   * @returns {Promise}
   */
  post(url, headers, body) {
    if (arguments.length === 2) {
      body = headers;
      headers = {};
    }
    return this.request('POST', url, headers, body);
  }

  /**
   * Perform a PUT request
   * @param   {string}  url
   * @param   {object}  [headers]
   * @param   {*}       body
   * @returns {Promise}
   */
  put(url, headers, body) {
    if (arguments.length === 2) {
      body = headers;
      headers = {};
    }
    return this.request('PUT', url, headers, body);
  }

  /**
   * Perform a DELETE request
   * @param   {string}  url
   * @param   {object}  [headers]
   * @returns {Promise}
   */
  delete(url, headers) {
    return this.request('DELETE', url, headers);
  }

}

module.exports = Client;