'use strict';
const ware = require('./ware');
const request = require('no-frills-request');
const Request = require('./Request');
const Response = require('./Response');
const Stream = require('./Stream');
const isARequest = require('./isARequest');
const isAResponse = require('./isAResponse');

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
    this._before = [];
    this._after = [];
  }

  /**
   * Register a middleware function that runs before a request is sent
   * @param   {function} ware
   * @returns {Client}
   */
  before(ware) {
    this._before.push(ware);
    return this;
  }

  /**
   * Register a middleware function that runs after a response is received
   * @param   {function} ware
   * @returns {Client}
   */
  after(ware) {
    this._after.push(ware);
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

      const runAfterMiddleWare = (response) => {
        ware(

          this._after,

          [response],

          (alteredResponse, next) => next(null, alteredResponse),

          (afterError, alteredResponse) => {
            if (afterError) return reject(afterError);
            return resolve(alteredResponse);
          }

        );
      };

      //run the middleware allowing changes to the request
      ware(

        this._before,

        [wrappedRequest],

        (requestOrResponse, next, done) => {
          if (isARequest(requestOrResponse)) {
            next(null, requestOrResponse);
          } else if (isAResponse(requestOrResponse)) {
            done(null, requestOrResponse);
          } else {
            done(new Error('Param is neither a request or response'));
          }
        },

        (beforeError, requestOrResponse) => {

          if (beforeError) {
            return reject(beforeError);
          }

          if (isAResponse(requestOrResponse)) {

            //short circuit the request and run the middleware allowing changes to the response
            runAfterMiddleWare(requestOrResponse);

          } else {

            //check the request has at least a method and a URL set
            if (!requestOrResponse.method) return reject(new Error('go-fetch: Request method is required.'));
            if (!requestOrResponse.url) return reject(new Error('go-fetch: go-fetch: Request URL is required.'));

            //perform the request
            request(
              requestOrResponse.method,
              requestOrResponse.url,
              {
                headers: requestOrResponse.headers,
                body: requestOrResponse.body
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
                runAfterMiddleWare(wrappedResponse);

              }
            );

          }

        }
      );

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
module.exports.Request = Request;
module.exports.Response = Response;