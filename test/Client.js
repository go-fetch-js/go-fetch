var assert = require('assert');
var server = require('simple-server-setup');
var Client = require('..');
var Request = require('../lib/Request');
var Response = require('../lib/Response');

var HTTPS_SERVER_OPTIONS = {
	secure: true,
	key:    __dirname+'/server.key',
	cert:   __dirname+'/server.cert'
};

var HTTPS_CLIENT_OPTIONS = {
	https_ignore_errors: true
};

describe('Client', function() {

	describe('constructor', function() {

		it('should create a new instance with the new keyword', function() {
			var client = new Client();
			assert(client instanceof Client);
		});

		it('should create a new instance with a function', function() {
			var client = Client();
			assert(client instanceof Client);
		});

	});

	describe('.send()', function() {

		it('should fetch a HTTP resource', function(done) {

			var srv = server.create(function(app) {
				app.get('/', function(req, res) {
					res.send('HTTP');
				});
			});

			srv.on('configured', function() {

				Client(HTTPS_CLIENT_OPTIONS).get(srv.url, function(error, response) {
					assert.equal(response.getStatus(), 200);
					assert.equal(error, undefined);
					srv.close(done);
				});

			});

		});

		it('should fetch a HTTPS resource', function(done) {

			var srv = server.create(HTTPS_SERVER_OPTIONS, function(app) {
				app.get('/', function(req, res) {
					res.send('HTTPS');
				});
			});

			srv.on('configured', function() {

				Client(HTTPS_CLIENT_OPTIONS).get(srv.url, function(error, response) {
					assert.equal(response.getStatus(), 200);
					assert.equal(error, undefined);
					srv.close(done);
				});

			});

		});

		it('should emit `before`');
		it('should emit `after`');
		it('should emit `sent`');
		it('should emit `received`');
		it('should emit `error`');

		it('should still have events registered on the `Response` before it is injected');
		it('should still call methods on the `Response` before it is injected');

	});

	describe('.request()', function() {

		describe('Callback-style', function(done) {

			it('should return a `Client`', function(done) {

				var client = Client().get('http://localhost/', function(err, res) {
						done();
					})
				;

				assert(client instanceof Client);

			});

			it('should handle different length arguments');
			it('should handle different length arguments');

			it('should call the callback on success');
			it('should call the callback on error');

			it('should call the callback with the global context');

			it('should pass an error if it cannot connect to the server');

		});

		describe('OOP-style', function() {

			it('should return a `Request`', function() {
				var request = Client().get('http://localhost/');
				assert(request instanceof Request);
			});

			it('should add a `.send()` method to the request', function() {
				var request = Client().get('http://localhost/');
				assert(typeof(request.send), 'function');
			});

		});

	});

});
