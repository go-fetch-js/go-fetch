var assert = require('assert');
var Request = require('../lib/Request');

describe('Request', function() {

	describe('.getUrl()', function() {

		it('should return the same URL if I do not set a new URL', function() {
			var request = new Request();
			assert.strictEqual(request.getUrl(), request.getUrl());
		});

	});

	describe('.toString()', function() {

		it('should create a POST request', function() {

			var output = (new Request())
				.setMethod('POST')
				.setUrl('http://example.com/path')
				.setHeader('Content-Type', 'application/x-www-form-urlencoded')
				.setBody('foo=bar&baz=bat')
				.toString()
			;

			assert.equal(
				'POST /path HTTP/1.1\r\n'+
				'Host: example.com\r\n'+
				'Content-Type: application/x-www-form-urlencoded\r\n'+
				'\r\n'+
				'foo=bar&baz=bat\r\n',
				output
			);

		});


	});

});
