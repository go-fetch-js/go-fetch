var fs          = require('fs');
var Client      = require('..');
var body        = require('go-fetch-body-parser');

Client()
	.use(body())
	.post('http://httpbin.org/post', {'Content-Type': 'text/x-markdown'}, fs.createReadStream(__dirname+'/../README.md'), function(error, response) {

		console.log(
			'Error: '+(error ? error : 'no error')+'\n'+
			'Status: '+response.getStatus()+'\n'+
			'Headers: '+JSON.stringify(response.getHeaders()).substr(0, 100)+'...'+'\n',
			response.getBody()
		);

	})
;
