var Client  = require('..');
var body    = require('go-fetch-body-parser');

Client()
	.use(function(client) {
		client.on('before', function(event) {
			event.preventDefault();
			event.response
				.setStatus(201)
				.setHeader('Content-Type', 'application/json; charset=utf-8')
				.setBody(JSON.stringify({
					message: 'Hello World!'
				}))
			;
		})
	})
	.get('http://api.myservice.io', function(error, response) {

		console.log(
			'Error: '+(error ? error : 'no error')+'\n'+
			'Status: '+response.getStatus()+'\n'+
			'Headers: '+JSON.stringify(response.getHeaders()).substr(0, 100)+'...'+'\n'+
			(response.getBody() ? response.getBody().substr(0, 100)+'...' : '')
		);

	})
;
