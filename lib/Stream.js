var util = require('util');
var Readable = require('stream').Readable;

function Stream(stream) {
	var self = this;

	this._source = stream;
	Readable.call(this);

	this._source.on('data', function(chunk) {
		if (!self.push(chunk)) self._source.pause();
	});

	this._source.on('end', function() {
		self.push(null);
	});

}
util.inherits(Stream, Readable);

Stream.prototype._read = function(size) {
	this._source.resume();
	return this;
};

/**
 * Abort the response
 * @returns {Stream}
 */
Stream.prototype.abort = function() {
	this._source.req.abort();
	return this;
};

/**
 * Destroy the response
 * @returns {Stream}
 */
Stream.prototype.destroy = function() {
	this.abort();
	this._source.destroy();
	return this;
};

module.exports = Stream;