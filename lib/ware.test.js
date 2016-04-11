'use strict';
const ware = require('./ware');

describe('ware()', () => {

  it('should not call each() when there are no wares', (done) => {
    let called = false;
    ware([], ['foo', 222, false], () => called = true, err => {
      expect(called).to.be.false;
      done(err);
    });
  });

  it('should call done() with arguments when there are no wares', (done) => {
    ware([], ['foo', 222, false], () => {/*do nothing*/}, function(err) {
      expect(arguments.length).to.be.equal(4);
      expect(arguments[0]).to.be.null;
      expect(arguments[1]).to.be.equal('foo');
      expect(arguments[2]).to.be.equal(222);
      expect(arguments[3]).to.be.equal(false);
      done(err);
    });
  });

  it('should call each ware()', (done) => {

    let calledA = false;
    let calledB = false;

    const wares = [
      function(a, b, c, next) {
        calledA = true;
        expect(arguments[0]).to.be.equal('foo');
        expect(arguments[1]).to.be.equal(222);
        expect(arguments[2]).to.be.equal(false);
        next(null, a, b, c);
      },
      function(a, b, c, next) {
        calledB = true;
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

  it('should call each() for each ware', (done) => {

    let count = 0;

    const wares = [
      (a, b, c, next) => next(null, a, b, c),
      (a, b, c, next) => next(null, a, b, c)
    ];

    const params = ['foo', 222, false];

    ware(wares, params, (a, b, c, next) => {
      count++;
      next(null, a, b, c);
    }, err => {
      expect(count).to.be.equal(2);
      done(err);
    });

  });

  it('should short-circuit when a ware() returns an error', (done) => {

    let count = 0;

    const wares = [
      (a, b, c, next) => next(null, a, b, c),
      (a, b, c, next) => next(new Error())
    ];

    const params = ['foo', 222, false];

    ware(wares, params, (a, b, c, next) => {
      count++;
      next(null, a, b, c);
    }, err => {
      expect(err).to.not.be.null;
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
    }, err => {
      expect(err).to.be.null;
      expect(count).to.be.equal(1);
      done();
    });

  });

});
