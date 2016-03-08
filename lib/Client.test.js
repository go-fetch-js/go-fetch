'use strict';
const Client = require('./Client');

describe('Client', () => {

  describe('before()', () => {
    it('should call middleware with req when the client receives a request');
  });

  describe('after()', () => {
    it('should call middleware with res when the client receives a response');
  });

  describe('use()', () => {
    it('should call a plugin with the client when the plugin is registered');
  });

  describe('request()', () => {
  });

});
