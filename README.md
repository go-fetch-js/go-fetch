# go-fetch

A pluggable HTTP client.

[![Circle CI](https://circleci.com/gh/go-fetch-js/go-fetch.svg?style=svg)](https://circleci.com/gh/go-fetch-js/go-fetch)

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
    			'Status: '+response.getStatus()+'\n'+
    			'Headers: '+JSON.stringify(response.getHeaders()).substr(0, 100)+'...'+'\n'+
    			(response.getBody() ? response.getBody().substr(0, 100)+'...' : '')
    		);
    
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
                'Status: '+response.getStatus()+'\n'+
                'Headers: '+JSON.stringify(response.getHeaders()).substr(0, 100)+'...'+'\n'+
                (response.getBody() ? response.getBody().substr(0, 100)+'...' : '')
            );
            
        })
    ;


## API

### Client

A HTTP client.

#### Methods

##### new Client(options) / Client(options)

Create a new client

- https_protocol
- https_ignore_errors

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

##### .setUrl(url) : String

Set the URL.

##### .setHeaders(headers : Object)

Set all the headers.

##### .setHeader(name : string, value : string)

Set a header value.

##### .setBody(data : string|Buffer|Stream)

Set the body data.

### Response

A HTTP response.

#### Methods

##### .getStatus() : number

Get the status code.

##### .getHeaders() : Object

Get all the headers.

##### .getHeader(name : string) : string

Get a header value.

##### .getBody() : string|Buffer|Stream

Get the body data.

##### .abort() : Response

Abort the response.

#### Events

## Plugins

Plugins are functions that are passed the client object do something with it. Plugins are executed when `.use()`d. Using the `before` and `after` events, plugins are able to add helper methods to the `Request` and `Response` objects, modify the request data sent to the server and process the response data received from the server.

### Example

Here's an example plugin that adds an `.isError()` method to the `Response` object.

    function plugin(client) {
		client.on('after', function (request, response) {

			response.isError = function() {
			    return response.getStatus() >= 400 && response.getStatus() < 600;
			};
			
		});
	}
	
### .prefixUrl(url)

Prefix each request URL with another URL unless the request URL already starts with a prefix of "http(s)://"

### .contentType

Parse the `Content-Type` header and add `.contentType` and `.charset` properties to the request object

### .body(options)

Concatenate the response stream and set it on the `.getBody()` property on the response object

- options.types - if an allowed list of types is specified, then only concatenate responses where the mime type is in the allowed list of types

### .OAuth1(options
[Here](https://www.npmjs.com/package/go-fetch-oauth1).

## ToDo

- Tests
- Plugins:
    - Compression (gzip/deflate)
    - Cookie Jar
    - OAuth v2
- Support for XMLHttpRequest in the browser

## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.