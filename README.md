# go-fetch

[![Circle CI](https://circleci.com/gh/go-fetch-js/go-fetch.svg?style=svg)](https://circleci.com/gh/go-fetch-js/go-fetch)

A pluggable HTTP client.

Go-fetch is a HTTP client for Node.js. It has a simple API but supports a lot of features via plugins.

## Features

- Support for HTTP and HTTPS
- Support for streaming
- Pluggable API with plugins for:
    - following redirects
    - compression
    - parsing JSON
    - authentication
    - ... and more

## Usage
    
### GET
    
Callback style:
    
    var Client  = require('go-fetch');
    var body    = require('go-fetch-body-parser');
    
    Client()
        .use(body())
        .get('http://httpbin.org/html', function(error, response) {
    
            console.log(
                'Error: '+(error ? error : 'no error')+'\n'+
                'Status: '+response.getStatus()+'\n'+
                'Headers: '+JSON.stringify(response.getHeaders()).substr(0, 100)+'...'+'\n'+
                (response.getBody() ? response.getBody().substr(0, 100)+'...' : '')
            );
    
        })
    ;
        
OOP style:
    
    var Client = require('go-fetch');
    var parseBody = require('go-fetch-parse-body');
    
    Client()
        .use(parseBody())
        .get('http://httpbin.org/html')
            .setHeader('User-Agent', 'go-fetch')
            .send(function(error, response) {
        
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
    
    var Client      = require('go-fetch');
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
    
Post a stream:
    
    var fs          = require('fs');
    var Client      = require('go-fetch');
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

##### .send(request) : Response

Send a request.

##### .send(request, callback) : Client

Send a request and handle the response.

##### .on(event, callback) : Client

Add an event listener.

##### .off(event, callback) : Client

Remove an event listener.

#### Events

##### before

Emitted before the request is sent to the server with the following arguments:

- event : Client.Event
    - .getName() : string
    - .getEmitter() : Client
    - .isDefaultPrevented() : bool
    - .preventDefault()
    - .isPropagationStopped() : bool
    - .stopPropagation()
    - .request : Client.Request
    - .response : Client.Response

Useful for plugins setting data on the request e.g. OAuth signature
    
##### after

Emitted after the request is sent to the server with the following arguments:


- event : Client.Event
    - .getName() : string
    - .getEmitter() : Client
    - .isPropagationStopped() : bool
    - .stopPropagation()
    - .request : Client.Request
    - .response : Client.Response


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

#### Events

##### sent
##### error

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

##### received
##### error

## Plugins

Plugins are functions that are passed the client object to do something with it. Plugins are executed when they are `.use()`d. Using the `before` and `after` events, plugins are able to add helper methods to the `Request` and `Response` objects, modify the request data sent to the server, process the response data received from the server, or cancel the request and use a locally constructed response instead.

### Example

Here's an example plugin that adds an `.isError()` method to the `Response` object.

    function plugin(client) {
		client.on('after', function (event) {
                        
			event.response.isError = function() {
			    return this.getStatus() >= 400 && this.getStatus() < 600;
			};
			
		});
	}
	
Here's an example plugin that returns a mocked request instead of a real one.

    function(client) {
        client.on('before', function(event) {
            event.preventDefault();
            event.response
                .setStatus(201)
                .setHeader('Content-Type', 'application/json; charset=utf-8')
                .setBody(JSON.stringify({
                    message: 'Hello World!'
                }))
            ;
        });
    }
	
### [prefix-url](https://www.npmjs.com/package/go-fetch-prefix-url)

Prefix each request URL with another URL.

### [content-type](https://www.npmjs.com/package/go-fetch-content-type)

Parse the Content-Type header.

### [parse-body](https://www.npmjs.com/package/go-fetch-parse-body)

Concatenate and parse the response stream.

### [auth](https://www.npmjs.com/package/go-fetch-auth)

Basic HTTP auth.

### [oauth1](https://www.npmjs.com/package/go-fetch-oauth1)

OAuth v1 authentication.

### [follow-redirects](https://www.npmjs.com/package/go-fetch-follow-redirects)

Automatically follow redirects.

### [decompress](https://www.npmjs.com/package/go-fetch-decompress)

Decompress response bodies compressed with gzip.

### [useragent](https://www.npmjs.com/package/go-fetch-useragent)

Add a User-Agent header to every request.

## ToDo

- Tests
- Plugins:
    - Cookie Jar
    - OAuth v2
- Support for XMLHttpRequest in the browser

## Changelog

### v2.0.0

 - moved `prefixUrl`, `contentType` and `body` plugins into their own repositories
 - changed the arguments passed to the `before` and `after` event handlers - handlers now receive a formal event object that allows propagation to be stopped and the request to be prevented
 - adding some tests
 - cleaning up documentation

## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.