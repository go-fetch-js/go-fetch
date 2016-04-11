'use strict';
const Request = require('./Request');
const Response = require('./Response');
const isARequest = require('./isARequest');

describe('isARequest()', () => {

  it('should return true', () => {
    expect(isARequest(new Request({method: 'get', url: 'http://www.example.com/'}))).to.be.true;
  });

  it('should return false', () => {
    expect(isARequest(undefined)).to.be.false;
    expect(isARequest(null)).to.be.false;
    expect(isARequest(false)).to.be.false;
    expect(isARequest(true)).to.be.false;
    expect(isARequest(1.23)).to.be.false;
    expect(isARequest('string')).to.be.false;
    expect(isARequest(['foo', 'bar'])).to.be.false;
    expect(isARequest({foo: 'bar'})).to.be.false;
    expect(isARequest(new Response({status: 200, reason: 'OK'}))).to.be.false;
  });

});
