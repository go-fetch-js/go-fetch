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
					assert(!error);
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

		it('should emit `before`', function(done) {

			var srv = server.create(function(app) {
				app.get('/', function(req, res) {
					res.send('SERVER');
				});
			});

			srv.on('configured', function() {
				var event;

				Client()
					.on('before', function(e) {event=e.getName();})
					.get(srv.url, function(error, response) {
						assert.equal(event, 'before');
						srv.close(done);
					})
				;

			});

		});

		it('`before` event should be stoppable', function(done) {

			var srv = server.create(function(app) {
				app.get('/', function(req, res) {
					res.send('SERVER');
				});
			});

			srv.on('configured', function() {
				var p1, p2;

				Client()
					.on('before', function(e) {p1=true;e.stopPropagation();})
					.on('before', function(e) {p2=true;})
					.get(srv.url, function(error, response) {
						assert(p1);
						assert(!p2);
						srv.close(done);
					})
				;

			});

		});

		it('`before` event should be preventable');
		it('should emit `after`', function(done) {

			var srv = server.create(function(app) {
				app.get('/', function(req, res) {
					res.send('SERVER');
				});
			});

			srv.on('configured', function() {
				var event;

				Client()
					.on('after', function(e) {event=e.getName();})
					.get(srv.url, function(error, response) {
						assert.equal(event, 'after');
						srv.close(done);
					})
				;

			});

		});

		it('`after` event should be stoppable', function(done) {

			var srv = server.create(function(app) {
				app.get('/', function(req, res) {
					res.send('SERVER');
				});
			});

			srv.on('configured', function() {
				var p1, p2;

				Client()
					.on('after', function(e) {p1=true;e.stopPropagation();})
					.on('after', function(e) {p2=true;})
					.get(srv.url, function(error, response) {
						assert(p1);
						assert(!p2);
						srv.close(done);
					})
				;

			});

		});

		it('should emit `sent`', function(done) {

			var srv = server.create(function(app) {
				app.get('/', function(req, res) {
					res.send('SERVER');
				});
			});

			srv.on('configured', function() {
				var called;

				Client()
					.on('sent', function() {called=true})
					.get(srv.url, function(error, response) {
						assert(called);
						srv.close(done);
					})
				;

			});

		});

		it('should emit `received`', function(done) {

			var srv = server.create(function(app) {
				app.get('/', function(req, res) {
					res.send('SERVER');
				});
			});

			srv.on('configured', function() {
				var called;

				Client()
					.on('received', function() {called=true})
					.get(srv.url, function(error, response) {
						assert(called);
						srv.close(done);
					})
				;

			});

		});

		it('should emit `error`', function(done) {
			var called;

			Client()
				.on('error', function() {called=true})
				.get('http://does.not.exist', function(error, response) {
					assert(called);
					done();
				})
			;

		});

		it('should emit `error` if a plugin fails `before`', function(done) {

			var srv = server.create(function(app) {
				app.get('/', function(req, res) {
					res.send('');
				});
			});

			srv.on('configured', function() {

				Client()
					.use(function(client) {
						client.on('before', function(event, next) {
							next(new Error('Plugin error'));
						});
					})
					.get(srv.url)
						.on('error', function(err) {
							assert.equal(err.message, 'Plugin error');
							srv.close(done);
						})
						.send()
				;

			});
		});

		it('should emit `error` if a plugin fails `after`', function(done) {

			var srv = server.create(function (app) {
				app.get('/', function (req, res) {
					res.send('');
				});
			});

			srv.on('configured', function () {

				Client()
					.use(function (client) {
						client.on('after', function (event, next) {
							next(new Error('Plugin error'));
						});
					})
					.get(srv.url)
						.send()
						.on('error', function (err) {
							assert.equal(err.message, 'Plugin error');
							srv.close(done);
						})
				;

			});

		});

		it('should still have events registered on the `Response` before it is injected');
		it('should still call methods on the `Response` before it is injected');

    it('should timeout after 1s', function(done) {

      var srv = server.create(function (app) {
        app.get('/', function (req, res) {
          //res.send('');
        });
      });

      srv.on('configured', function() {

        Client({timeout: 1000})
          .use(function(client) {
            client.on('after', function(event, next) {
              next(new Error('Plugin error'));
            });
          })
          .get(srv.url, function(err) {
            assert.equal(err.code, 'ECONNRESET');
            srv.close(done);
          })
        ;

      });

    });

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
