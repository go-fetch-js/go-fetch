'use strict';
const Response = require('./Response');

describe('Response', () => {

  describe('constructor()', () => {

    it('should default .version', () => {
      const req = new Response();
      expect(req).to.have.property('version').equal('1.1');
    });

    it('should set .version', () => {
      const req = new Response({version: '1.0'});
      expect(req).to.have.property('version').equal('1.0');
    });

    it('should default .status', () => {
      const req = new Response();
      expect(req).to.have.property('status').equal(0);
    });

    it('should set .status', () => {
      const req = new Response({status: 200});
      expect(req).to.have.property('status').equal(200);
    });

    it('should default .reason', () => {
      const req = new Response();
      expect(req).to.have.property('reason').equal('');
    });

    it('should set .reason', () => {
      const req = new Response({reason: 'OK'});
      expect(req).to.have.property('reason').equal('OK');
    });

    it('should default .headers', () => {
      const req = new Response();
      expect(req).to.have.property('headers').deep.equal({});
    });

    it('should set .headers', () => {
      const req = new Response({headers: {'content-type': 'text-html'}});
      expect(req).to.have.property('headers').deep.equal({'content-type': 'text-html'});
    });

    it('should default .body', () => {
      const req = new Response();
      expect(req).to.have.property('body').equal(null);
    });

    it('should set .body', () => {
      const req = new Response({body: 'foo=bar'});
      expect(req).to.have.property('body').equal('foo=bar');
    });

  });

  describe('toString()', () => {

    it('should represent the Response as a string', () => {
      const req = new Response({
        status: 200,
        reason: 'OK',
        headers: {'content-type': 'text-html'},
        body: '<html>'
      });
      expect(req.toString()).to.equal('HTTP/1.1 200 OK\r\ncontent-type: text-html\r\n\r\n<html>');
    });

  });

});
