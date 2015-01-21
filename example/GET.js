var Client = require('..');

Client()
	.use(Client.plugins.body())
	.get('http://httpbin.org/html', function(error, response) {

		console.log(
			'Error: '+(error ? error : 'no error')+'\n'+
			'Status: '+response.getStatus()+'\n'+
			'Headers: '+JSON.stringify(response.getHeaders()).substr(0, 100)+'...'+'\n'+
			(response.getBody() ? response.getBody().substr(0, 100)+'...' : '')
		);

	})
;
