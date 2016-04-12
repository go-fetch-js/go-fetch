'use strict';
const ware = require('./ware');

describe('ware()', () => {

  it('should call done() with an error when a middleware returns an inconsistent number of arguments', (done) => {

    let calledA = false;
    let calledB = false;

    const wares = [
      (a, b, c, next) => {
        next(null, a, b);
      }
    ];

    const params = ['foo', 222, false];

    ware(wares, params, (a, b, c, next, done) => next(null, a, b, c), err => {
      expect(err).to.not.be.null;
      done();
    });

  });

  it('should call done() without calling each() when there are 0 middlewares', (done) => {
    let called = false;
    ware([], ['foo', 222, false], () => called = true, function(err) {
      expect(called).to.be.false;
      expect(arguments.length).to.be.equal(4);
      expect(arguments[0]).to.be.null;
      expect(arguments[1]).to.be.equal('foo');
      expect(arguments[2]).to.be.equal(222);
      expect(arguments[3]).to.be.equal(false);
      done(err);
    });
  });

  it('should call each middleware when there are more than 0 middlewares', (done) => {

    let calledA = false;
    let calledB = false;

    const wares = [
      function(a, b, c, next) {
        calledA = true;
        expect(arguments.length).to.be.equal(4);
        expect(arguments[0]).to.be.equal('foo');
        expect(arguments[1]).to.be.equal(222);
        expect(arguments[2]).to.be.equal(false);
        next(null, a, b, c);
      },
      function(a, b, c, next) {
        calledB = true;
        expect(arguments.length).to.be.equal(4);
        expect(arguments[0]).to.be.equal('foo');
        expect(arguments[1]).to.be.equal(222);
        expect(arguments[2]).to.be.equal(false);
        next(null, a, b, c);
      }
    ];

    const params = ['foo', 222, false];

    ware(wares, params, (a, b, c, next, done) => next(null, a, b, c), err => {
      expect(calledA).to.be.true;
      expect(calledB).to.be.true;
      done(err);
    });

  });

  it('should call each() for each middleware', (done) => {

    let count = 0;

    const wares = [
      (a, b, c, next) => next(null, a, b, c),
      (a, b, c, next) => next(null, a, b, c)
    ];

    const params = ['foo', 222, false];

    ware(wares, params, function(a, b, c, next) {
      count++;
      expect(arguments.length).to.be.equal(5);
      expect(arguments[0]).to.be.equal('foo');
      expect(arguments[1]).to.be.equal(222);
      expect(arguments[2]).to.be.equal(false);
      next(null, a, b, c);
    }, err => {
      expect(count).to.be.equal(2);
      done(err);
    });

  });

  it('should short-circuit when a ware() calls next() with an error', (done) => {

    let count = 0;

    const wares = [
      (a, b, c, next) => next(null, a, b, c),
      (a, b, c, next) => next(new Error())
    ];

    const params = ['foo', 222, false];

    ware(wares, params, (a, b, c, next) => {
      count++;
      next(null, a, b, c);
    }, function() {
      expect(arguments.length).to.be.equal(1);
      expect(arguments[0]).to.not.be.null;
      expect(count).to.be.equal(1);
      done();
    });

  });

  it('should short-circuit when a each() calls done()', (done) => {

    let count = 0;

    const wares = [
      (a, b, c, next) => next(null, a, b, c),
      (a, b, c, next) => next(new Error())
    ];

    const params = ['foo', 222, false];

    ware(wares, params, (a, b, c, next) => {
      count++;
      done(null, a, b, c);
    }, function() {
      expect(arguments.length).to.be.equal(1);
      expect(arguments[0]).to.be.null;
      expect(count).to.be.equal(1);
      done();
    });

  });

});
