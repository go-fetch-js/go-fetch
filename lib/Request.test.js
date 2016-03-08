'use strict';
const Request = require('./Request');

describe('Request', () => {

  describe('constructor()', () => {

    it('should default .version', () => {
      const req = new Request();
      expect(req).to.have.property('version').equal('1.1');
    });

    it('should default .method', () => {
      const req = new Request();
      expect(req).to.have.property('method').equal('');
    });

    it('should set .method', () => {
      const req = new Request({method: 'PATCH'});
      expect(req).to.have.property('method').equal('PATCH');
    });

    it('should uppercase .method', () => {
      const req = new Request({method: 'patch'});
      expect(req).to.have.property('method').equal('PATCH');
    });

    it('should default .url', () => {
      const req = new Request();
      expect(req).to.have.property('url').equal('');
    });

    it('should set .url', () => {
      const req = new Request({url: 'http://google.com'});
      expect(req).to.have.property('url').equal('http://google.com');
    });

    it('should default .headers', () => {
      const req = new Request();
      expect(req).to.have.property('headers').deep.equal({});
    });

    it('should set .headers', () => {
      const req = new Request({headers: {'x-forwarded-for': '127.0.0.1'}});
      expect(req).to.have.property('headers').deep.equal({'x-forwarded-for': '127.0.0.1'});
    });

    it('should default .body', () => {
      const req = new Request();
      expect(req).to.have.property('body').equal(null);
    });

    it('should set .body', () => {
      const req = new Request({body: 'foo=bar'});
      expect(req).to.have.property('body').equal('foo=bar');
    });

  });

  describe('toString()', () => {

    it('should represent the request as a string', () => {
      const req = new Request({
        method: 'GET',
        url: 'http://google.com?q=http',
        body: 'foo=bar'
      });
      expect(req.toString()).to.equal('GET /?q=http HTTP/1.1\r\nhost: google.com\r\n\r\nfoo=bar');
    });

  });

});
