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

	describe('.getQuery()', function() {

		it('should return a dictionary when I don\'t pass a parameter name', function() {
			var url = new Url('http://www.google.com?page=first');
			assert.deepEqual(url.getQuery(), {page: 'first'});
		});

		it('should return a value when I pass a parameter name', function() {
			var url = new Url('http://localhost/?letters=abc');
			assert.equal(url.getQuery('letters'), 'abc');
		});

		it('should return undefined when the query parameter isn\'t found', function() {
			var url = new Url('http://localhost/?letters=abc');
			assert.equal(url.getQuery('foobar'), undefined);
		});

		it('should return the default value when the query parameter isn\'t found', function() {
			var url = new Url('http://localhost/?letters');
			assert.equal(url.getQuery('letters', '123'), '123');
		});

	});

	describe('.setQuery()', function() {

		it('should replace the dictionary when I don\'t pass a parameter name', function() {
			var url = new Url('http://localhost/?letters=abc');
			url.setQuery({'foobar': 'power'});
			assert.deepEqual(url.getQuery(), {'foobar': 'power'});
		});

		it('should replace the param when I pass a parameter name and value', function() {
			var url = new Url('http://localhost/?letters=abc');
			url.setQuery('letters', '123');
			assert.equal(url.getQuery('letters'), 123);
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

    it('should convert an object to a query string', function() {

      var url = new Url('https://api.planningcenteronline.com/people/v2/');
      url.setQuery({'where[first_name]': 'John'})

      assert.equal(
        'https://api.planningcenteronline.com/people/v2/?where%5Bfirst_name%5D=John',
        url.toString()
      );

    });

    it('should convert a nested object to a query string', function() {

      var url = new Url('https://api.planningcenteronline.com/people/v2/');
      url.setQuery({where: {first_name: 'John'}})

      assert.equal(
        'https://api.planningcenteronline.com/people/v2/?where%5Bfirst_name%5D=John',
        url.toString()
      );

    });


  });

});
