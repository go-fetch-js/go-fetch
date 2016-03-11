'use strict';
const Readable = require('stream').Readable;

/**
 * A HTTP stream
 * @class
 */
class Stream extends Readable {

  /**
   * Create a stream
   * @param   {Stream} stream
   */
  constructor(stream) {
    super();

    this.source = stream;

    this.source.on('data', chunk => {
      if (!this.push(chunk)) {
        this.source.pause();
      }
    });

    this.source.on('end', () => {
      this.push(null);
    });
  }

  _read(size) {
    this.source.resume();
    return this;
  }

  //
  //abort() {
  //  this.source.req.abort();
  //  return this;
  //}
  //
  //destroy() {
  //  this.abort();
  //  this.source.destroy();
  //  return this;
  //}

  toString() {
    return `<Stream>`
  }

}

module.exports = Stream;