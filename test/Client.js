var assert = require('assert');


describe('Client', function() {

	describe('.send()', function() {

		it('should fetch a HTTP resource');
		it('should fetch a HTTPS resource');

		it('should emit `before`');
		it('should emit `after`');
		it('should emit `headers`');
		it('should emit `error`');

		it('should still have events registered on the `Response`');

	});

	describe('.request()', function() {

		describe('Callback-style', function() {

			it('should return a `Response`');

			it('should handle different length arguments');
			it('should handle different length arguments');

			it('should call the callback on success');
			it('should call the callback on error');

			it('should call the callback with the global context');

		});

		describe('OOP-style', function() {

			it('should return a `Request`');
			it('should add a `.send()` method to the request');

		});

	});

});
