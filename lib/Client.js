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
   */
  constructor() {
    this._before = ware();
    this._after = ware();
  }

  /**
   * Register a middleware function that runs before the request is sent
   * @param   {function} middleware
   * @returns {Client}
   */
  before(middleware) {
    this._before.use(middleware);
    return this;
  }

  /**
   * Register a middleware function that runs after the response is received
   * @param   {function} middleware
   * @returns {Client}
   */
  after(middleware) {
    this._after.use(middleware);
    return this;
  }

  /**
   * Perform a request
   * @param   {string} method
   * @param   {string} url
   * @param   {object} [headers]
   * @param   {string} [body]
   * @returns {Promise}
   */
  request(method, url, headers, body) {
    return new Promise((resolve, reject) => {

      const wrappedRequest = new Request({
        method,
        url
      });

      //run the middleware allowing changes to the request
      this._before.run(wrappedRequest, (beforeError, alteredRequest) => {
        if (beforeError) return reject(beforeError);

        if (!alteredRequest.method) return reject(new Error('go-fetch: Request method is required.'));
        if (!alteredRequest.url) return reject(new Error('go-fetch: go-fetch: Request URL is required.'));

        //send the request
        try {

          request(
            alteredRequest.method,
            alteredRequest.url,
            {headers: {}},
            (err, res) => {
              if (err) return reject(err);

              const wrappedResponse = new Response({
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
        } catch (err) {
          return reject(err);
        }

      });

    });
  }

  get(url, headers) {
    return this.request('GET', url, headers);
  }

}

module.exports = Client;