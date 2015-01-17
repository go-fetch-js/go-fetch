# go-fetch

A pluggable HTTP client.

## Features

- Support for HTTP and HTTPS
- Support for streaming
- Pluggable API

## Usage
    
### GET
    
Callback style:
    
    var Client = require('go-fetch');
    
    Client()
        .use(Client.plugins.body())
        .get('http://httpbin.org/html', function(error, response) {
        
            console.log(
                'Error: '+(error ? error : 'no error')+'\n'+
                'Status: '+response.status()+'\n'+
                'Headers: '+JSON.stringify(response.headers()).substr(0, 100)+'...'+'\n'+
                (response.body ? response.body.substr(0, 100)+'...' : '')
            );
            
            response.end();
        })
    ;
    
### POST

Callback style:

    var Client = require('go-fetch');
    
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

## API

### Client

A HTTP client.

#### Methods

##### new Client() / Client()

Create a new client

##### .use(plugin) : Client

Apply a plugin on this client. 

Plugins are passed the client object. 

##### .get(url, headers) : Request

##### .get(url, headers, callback) : Client

##### .post(url, headers, data) : Request

##### .post(url, headers, data, callback) : Client

##### .put(url, headers, data) : Request

##### .put(url, headers, data, callback) : Client

##### .delete(url, headers, data) : Request

##### .delete(url, headers, data, callback) : Client

##### .on(event, callback) : Client

Add an event listener.

##### .off(event, callback) : Client

Remove an event listener.

#### Events

##### before

Emitted before the request is sent to the server with the following arguments:

- request : Request
- response : Response

Useful for plugins setting data on the request e.g. OAuth signature
    
##### after

Emitted after the request is sent to the server with the following arguments:

- request : Request
- response : Response

Useful for plugins processing and setting data on the response e.g. gzip/deflate

##### error

Emitted when an error occurs.

- error : Error

### Request

A HTTP request.

#### Methods

##### new Request(method, url, headers, body)

Create a new request.

##### .url() : String

Get the URL.

##### .headers() : Object

##### .header() : String

##### .header(name, value) : Request

##### .body() : String

##### .body(data) : Request

### Response

A HTTP response.

#### Methods

##### .status() : Number

Get the status code.

##### .headers() : Object

Get all the headers.

##### .header(name) : String

Get a header value.

##### .end() : Response

End the response.

#### Events

## Plugins

Plugins are simply just functions which are passed the client object and executed when they are `.use()`d. Using the `before` and `after` events, plugins can add helper methods to the `Request` and `Response` objects, modify the request data sent to the server, and process the response data received from the server.

### Example

An example function to add a `.isError()` method to the `Response` object.

    function(client) {

		client.on('after', function (request, response) {

			response.isError = function() {
			    return response.status() >= 400 && response.status() < 600;
			};
			
		});

	}

## ToDo

- Posting data
- Tests
- Plugins:
    - OAuth v1
    - OAuth v2
    - Compression (gzip/deflate)
    - Cookie Jar
- Support for XMLHttpRequest in the browser

## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.