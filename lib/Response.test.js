'use strict';
const streamifier = require('streamifier').createReadStream;
const Response = require('./Response');

describe('Response', () => {

  describe('constructor()', () => {

    it('should default .version', () => {
      const res = new Response();
      expect(res).to.have.property('version').equal('1.1');
    });

    it('should set .version', () => {
      const res = new Response({version: '1.0'});
      expect(res).to.have.property('version').equal('1.0');
    });

    it('should default .status', () => {
      const res = new Response();
      expect(res).to.have.property('status').equal(0);
    });

    it('should set .status', () => {
      const res = new Response({status: 200});
      expect(res).to.have.property('status').equal(200);
    });

    it('should default .reason', () => {
      const res = new Response();
      expect(res).to.have.property('reason').equal('');
    });

    it('should set .reason', () => {
      const res = new Response({reason: 'OK'});
      expect(res).to.have.property('reason').equal('OK');
    });

    it('should default .headers', () => {
      const res = new Response();
      expect(res).to.have.property('headers').deep.equal({});
    });

    it('should set .headers', () => {
      const res = new Response({headers: {'content-type': 'text-html'}});
      expect(res).to.have.property('headers').deep.equal({'content-type': 'text-html'});
    });

    it('should default .body', () => {
      const res = new Response();
      expect(res).to.have.property('body').equal(null);
    });

    it('should set .body', () => {
      const res = new Response({body: 'foo=bar'});
      expect(res).to.have.property('body').equal('foo=bar');
    });

  });

  describe('.text()', () => {

    it('should read text', () => {
      const res = new Response({body: streamifier('Hello World!')});
      return res.text()
        .then(text => expect(text).to.be.equal('Hello World!'))
        .catch(err => expect(err).to.be.null)
      ;
    });

    //TODO: handling errors

  });

  describe('toString()', () => {

    it('should represent the Response as a string', () => {
      const res = new Response({
        status: 200,
        reason: 'OK',
        headers: {'content-type': 'text-html'},
        body: '<html>'
      });
      expect(res.toString()).to.equal('HTTP/1.1 200 OK\r\ncontent-type: text-html\r\n\r\n<html>');
    });

  });

});
