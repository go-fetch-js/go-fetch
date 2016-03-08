'use strict';
const streamifier = require('streamifier').createReadStream;
const Stream = require('./Stream');

describe('Stream', () => {

  //TODO: piping, handling errors etc etc

  describe('.data()', () => {

    it('should read data', () => {
      const stream = new Stream(streamifier('Hello World!'));
      return stream.data()
        .then(data => expect(data).to.be.equal('Hello World!'))
        .catch(err => expect(err).to.be.null)
      ;
    });

    //TODO: handling errors

  });

});
