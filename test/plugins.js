var assert = require('assert');
var Client = require('..');
var plugins = require('../lib/plugins');
var Request = require('../lib/Request');
var Response = require('../lib/Response');

describe('Plugins', function() {

	describe('baseUrl', function() {

		it('should not prefix URLs which start with http://', function() {

			var client    = new Client();
			var plugin    = plugins.prefixUrl('http://api.github.com/');
			var request   = new Request('GET', 'http://www.digitaledgeit.com.au/favicon.ico');
			var response  = new Response();

			//init the plugin
			plugin(client);

			//run the plugin
			client.emit('before', request, response);

			//check the result
			assert.equal(request.getUrl().toString(), 'http://www.digitaledgeit.com.au/favicon.ico');

		});

		it('should not prefix URLs which start with https://', function() {

			var client    = new Client();
			var plugin    = plugins.prefixUrl('http://api.github.com/');
			var request   = new Request('GET', 'https://www.digitaledgeit.com.au/favicon.ico');
			var response  = new Response();

			//init the plugin
			plugin(client);

			//run the plugin
			client.emit('before', request, response);

			//check the result
			assert.equal(request.getUrl().toString(), 'https://www.digitaledgeit.com.au/favicon.ico');

		});

		it('should prefix URLs which do not start with http(s)://', function() {

			var client    = new Client();
			var plugin    = plugins.prefixUrl('https://api.github.com/');
			var request   = new Request('GET', 'users/digitaledgeit/repos');
			var response  = new Response();

			//init the plugin
			plugin(client);

			//run the plugin
			client.emit('before', request, response);

			//check the result
			assert.equal(request.getUrl().toString(), 'https://api.github.com/users/digitaledgeit/repos');

		});

	});

	describe('contentType', function() {

		it('should add methods to the request and response objects', function() {

			var client    = new Client();
			var plugin    = plugins.contentType;
			var request   = new Request('GET', 'users/digitaledgeit/repos', {'Content-Type': 'application/json'});
			var response  = new Response();

			//init the plugin
			plugin(client);

			//run the plugin
			client.emit('before', request, response);

			//check the result
			assert.equal(request.getContentType(), 'application/json');

		});


	});

});
