'use strict';

var Readable = require('stream').Readable;

class Stream extends Readable {

  constructor(stream) {
    super();

    this._source = stream;

    this._source.on('data', chunk => {
      if (!this.push(chunk)) this._source.pause();
    });

    this._source.on('end', () => {
      this.push(null);
    });
  }

  _read(size) {
    this._source.resume();
    return this;
  }


  abort() {
    this._source.req.abort();
    return this;
  }

  destroy() {
    this.abort();
    this._source.destroy();
    return this;
  }

}

module.exports = Stream;