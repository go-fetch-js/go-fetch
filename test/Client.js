var assert = require('assert');
var server = require('simple-server-setup');
var Client = require('..');

var HTTPS_SERVER_OPTIONS = {
	secure: true,
	key:    __dirname+'/server.key',
	cert:   __dirname+'/server.cert'
};

var HTTPS_CLIENT_OPTIONS = {
	https_ignore_errors: true
};

describe('Client', function() {

	describe('.send()', function() {

		it('should fetch a HTTP resource', function(done) {

			var srv = server.create(function(app) {
				app.get('/', function(req, res) {
					res.send('HTTP');
					srv.close();
				});
			});

			Client().get(srv.url, function(error, response) {
				assert.equal(response.status(), 200);
				assert.equal(error, undefined);
				done();
			});

		});

		it('should fetch a HTTPS resource', function(done) {

			var srv = server.create(HTTPS_SERVER_OPTIONS, function(app) {
				app.get('/', function(req, res) {
					res.send('HTTPS');
					srv.close();
				});
			});

			Client(HTTPS_CLIENT_OPTIONS).get(srv.url, function(error, response) {
				assert.equal(response.status(), 200);
				assert.equal(error, undefined);
				done();
			});

		});

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
