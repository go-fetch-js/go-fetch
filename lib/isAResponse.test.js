'use strict';
const Request = require('./Request');
const Response = require('./Response');
const isAResponse = require('./isAResponse');

describe('isARequest()', () => {

  it('should return true', () => {
    expect(isAResponse(new Response({status: 200, reason: 'OK'}))).to.be.true;
  });

  it('should return false', () => {
    expect(isAResponse(undefined)).to.be.false;
    expect(isAResponse(null)).to.be.false;
    expect(isAResponse(false)).to.be.false;
    expect(isAResponse(true)).to.be.false;
    expect(isAResponse(1.23)).to.be.false;
    expect(isAResponse('string')).to.be.false;
    expect(isAResponse(['foo', 'bar'])).to.be.false;
    expect(isAResponse({foo: 'bar'})).to.be.false;
    expect(isAResponse(new Request({method: 'get', url: 'http://localhost/'}))).to.be.false;
  });

});
