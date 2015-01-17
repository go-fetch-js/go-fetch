# go-fetch

A pluggable HTTP client.

## Features

- Support for HTTP and HTTPS
- Support for streaming
- Pluggable API

## Usage
    
### GET
    
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


## Methods

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