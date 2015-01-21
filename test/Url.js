var assert = require('assert');
var Url = require('../lib/Url');

describe('Url', function() {

	describe('new Url()', function() {

		it('should create a new instance with a URL', function() {
			var url = new Url('http://www.google.com');
		});

		it('should create a new instance with no URL', function() {
			var url = new Url();
		});

	});

	describe('.toString()', function() {

		it('should convert the URL to a string representation of the URL', function() {

			var url = new Url('http://www.digitaledgeit.com.au/contact');

			assert.equal(
				'http://www.digitaledgeit.com.au/contact',
				url.toString()
			);

		});

	});

});
