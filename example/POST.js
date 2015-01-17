var Client = require('..');

Client()
	.use(Client.plugins.body())
	.post('http://httpbin.org/post', {'Content-Type': 'application/json'}, JSON.stringify({msg: 'Go fetch!'}), function(error, response) {

		console.log(
			'Error: '+(error ? error : 'no error')+'\n'+
			'Status: '+response.status()+'\n'+
			'Headers: '+JSON.stringify(response.headers()).substr(0, 100)+'...'+'\n'+
			(response.body ? response.body.substr(0, 100)+'...' : '')
		);

		response.end();
	})
;