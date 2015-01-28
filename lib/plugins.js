var parseHeader = require('parse-http-header');

module.exports = {

	/**
	 * Prefix each request URL with another URL unless the request URL already starts with a prefix of "http(s)://"
	 * @param   {string} url The base URL
	 * @returns {function(Client)}
	 */
	prefixUrl: function(url) {
		return function(client) {
			client.on('before', function(request, response) {

				var partialUrl = request.getUrl().toString();

				if (!/^http(s)?:\/\//.test(partialUrl)) {
					request.setUrl(url+partialUrl);
				}

			});
		};
	},

	/**
	 * Parse the `Content-Type` header and add `.contentType` and `.charset` properties to the request object
	 * @param   {Client} client
	 */
	contentType: function(client) {

		/**
		 * Get the content type
		 * @returns {string}
		 */
		function getContentType() {
			var header = parseHeader(this.getHeader('Content-Type')+'; ');
			if (typeof(header[0]) !== 'undefined') {
				return header[0];
			} else {
				return null;
			}
		};

		/**
		 * Get the content charset
		 * @returns {string}
		 */
		function getCharset() {
			var header = parseHeader(this.getHeader('Content-Type'));
			if (typeof(header['charset']) !== 'undefined') {
				return header['charset'];
			} else {
				return null;
			}
		};

		client.on('before', function (request, response) {

			request.getContentType  = getContentType;
			request.getCharset      = getCharset;

			response.getContentType = getContentType;
			response.getCharset     = getCharset;

		});

	},

	/**
	 * Concatenate the response stream and add it on a `.body` property on the response object
	 *  - will block the `headers` event from firing until all the content is read
	 * @param   {Object}  options           The plugin options
	 * @param   {Array.<string>}   [options.types]   The mime types for which the body is concatenated for. Useful when you don't want to load the whole body for certain types (e.g. binary files which tend to be larger than text files). Defaults to all files.
	 * @returns {function(Client)}
	 */
	body: function(options) {
		console.warn('The `go-fetch` `body()` plugin is depreciated. Use the `go-fetch-read-body` plugin instead.');

		/**
		 * Concatenate all of the stream's content into to a property on the response
		 * @param   {Client} client
		 */
		return function(client) {

			client.on('after', function (request, response, done) {
				var body = '';

				//if an allowed list of types is specified, then only concatenate responses where the mime type is in the allowed list of types
				if (options && options.types) {
					if (typeof(response.getContentType()) === 'undefined' || options.types.indexOf(response.getContentType()) === -1) {
						return done();
					}
				}

				response.getBody().on('data', function (data) {
					body += data.toString();
				});

				response.getBody().on('end', function () {
					response.setBody(body);
					done();
				});

			});

		};

	}

};