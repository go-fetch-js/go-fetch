var Client      = require('..');
var body        = require('go-fetch-body-parser');
var contentType = require('go-fetch-content-type');

Client()
	.use(contentType)
	.use(body.json())
	.post('http://httpbin.org/post', {'Content-Type': 'application/json'}, JSON.stringify({msg: 'Go fetch!'}), function(error, response) {

		console.log(
			'Error: '+(error ? error : 'no error')+'\n'+
			'Status: '+response.getStatus()+'\n'+
			'Headers: '+JSON.stringify(response.getHeaders()).substr(0, 100)+'...'+'\n',
			response.getBody()
		);

	})
;
