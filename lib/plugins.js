var parseHeader = require('parse-http-header');

module.exports = {

	/**
	 * A plugin to parse the `Content-Type` header
	 * @param   {Client} client
	 */
	contentType: function(client) {

		client.on('after', function (request, response) {

			var header = parseHeader(response.header('content-type'));

			if (typeof(header[0]) !== 'undefined') {
				response.contentType = header[0];
			}

			if (typeof(header['charset']) !== 'undefined') {
				response.charset = header['charset'];
			}

		});

	},

	/**
	 * A plugin to concatenate all of the stream's content into to a property on the response
	 *  - will block the `headers` event from firing until all the content is read
	 * @param   {Object}  options           The plugin options
	 * @param   {Array}   [options.types]   The mime types for which the body is concatenated for. Useful when you don't want to load the whole body for certain types (e.g. binary files which tend to be larger than text files). Defaults to all files.
	 */
	body: function(options) {

		/**
		 * Concatenate all of the stream's content into to a property on the response
		 * @param   {Client} client
		 */
		return function(client) {

			client.on('after', function (request, response, done) {
				var body = '';

				//if an allowed list of mime types is specified, then only parse the body of responses who's content mime type is in the allowed list of mime type
				if (options && options.types) {
					if (typeof(response.contentType) === 'undefined' || options.types.indexOf(response.contentType) === -1) {
						return done();
					}
				}

				response.on('data', function (data) {
					body += data.toString();
				});

				response.on('end', function () {
					response.body = body;
					done();
				});

			});

		};

	}

};