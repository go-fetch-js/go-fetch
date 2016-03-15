# go-fetch

[![Build Status](https://travis-ci.org/go-fetch-js/go-fetch.svg?branch=master)](https://travis-ci.org/go-fetch-js/go-fetch)

A pluggable HTTP client for Node.JS.

`go-fetch` boasts a simple API but supports many features through plugins.

**Features:**

- Support for `HTTP` and `HTTPS` protocols
- Support for streaming
- Pluggable API with plugins for:
    - following redirects
    - compression
    - authentication
    - working with JSON
    - ...and lots more

## Installation

    npm install --save go-fetch

## Usage
    
### GET
    
```javascript

const Client = require('go-fetch');
const json = require('go-fetch-json');

new Client()
  .use(json())
  .get('http://httpbin.org/get')
    .then(res => {
      console.log(res.toString());
      return res.json();
    })
    .then(json => console.log(json))
    .catch(err => console.error(err.stack))
;

```

### POST

```javascript

const Client = require('go-fetch');
const json = require('go-fetch-json');

new Client()
  .use(json())
  .post('http://httpbin.org/post', {msg: 'Go fetch!'})
    .then(res => {
      console.log(res.toString());
      return res.json();
    })
    .then(json => console.log(json))
    .catch(err => console.error(err.stack))
;

```

## API

### Client

A HTTP client.


```
new Client([options : object])
```

Create a new `HTTP` client.

**Options:**

```
.use(plugin : function) : Client
```

Extend the functionality with a plugin.

**Parameters:**

- `plugin` Required. A plugin function.

**Returns:**

The client.

```
.before(middleware : function) : Client
```

Extend the functionality with a middleware function which is run before a request is sent.

**Parameters:**

- `middleware` Required. A middleware function.

**Returns:**

The client.

```
.after(middleware : function) : Client
```

Extend the functionality with a middleware function which is run after a request is sent.

**Parameters:**

- `middleware` Required. A middleware function.

**Returns:**

The client.

```
.get(url : string, [headers : object]) : Promise
```

Send a `HTTP` `GET` request.

**Parameters:**

- `url` Required. The request URL.
- `headers` Optional. The request headers. An object containing key-value pairs.

**Returns:**

A `Promise`. Resolves with a `Response`. Rejects with an `Error`.

```
.post(url : string, [headers : object], [body : *]) : Promise
```

Send a `HTTP` `POST` request.

**Parameters:**

- `url` Required. The request URL.
- `headers` Optional. The request headers. An object containing key-value pairs.
- `body` Optional. The request body. May be a string or a stream.

**Returns:**

A `Promise`. Resolves with a `Response`. Rejects with an `Error`.

```
.put(url : string, [headers : object], [body : *]) : Promise
```

Send a `HTTP` `PUT` request.

**Parameters:**

- `url` Required. The request URL.
- `headers` Optional. The request headers. An object containing key-value pairs.
- `body` Optional. The request body. May be a string or a stream.

**Returns:**

A `Promise`. Resolves with a `Response`. Rejects with an `Error`.

```
.delete(url : string, [headers : object]) : Promise
```

Send a `HTTP` `DELETE` request.

**Parameters:**

- `url` Required. The request URL.
- `headers` Optional. The request headers. An object containing key-value pairs.

**Returns:**

A `Promise`. Resolves with a `Response`. Rejects with an `Error`.

```
.request(method : string, url : string, [headers : object], [body : *]) : Promise
```

Send a `HTTP` request.

**Parameters:**

- `method` Required. The request method.
- `url` Required. The request URL.
- `headers` Optional. The request headers. An object containing key-value pairs.
- `body` Optional. The request body. May be a string or a stream.

**Returns:**

A `Promise`. Resolves with a `Response`. Rejects with an `Error`.

### Request

A HTTP request.

```
new Request([options : object])
```

Create a new request.

**Options:**

- `method` Required. The request method.
- `url` Required. The request URL.
- `headers` Optional. The request headers. An object containing key-value pairs.
- `body` Optional. The request body. May be a string or a stream.

```
.method : string
```

The request method.

```
.url : string
```

The request URL.

```
.headers : object
```

The request headers. An object containing key-value pairs.

```
.body : *
```

The request body. May be a string or a stream.

### Response

A HTTP response.

```
new Response([options : object])
```

Create a new request.

**Options:**

- `status` Required. The request method.
- `url` Required. The request URL.
- `headers` Optional. The request headers. An object containing key-value pairs.
- `body` Optional. The request body. May be a string or a stream.

```
.status : number
```

The response stats.

```
.reason : string
```

The response reason.

```
.headers : object
```

The response headers. An object containing key-value pairs.

```
.body : *
```

The response body. May be a string or a stream. Usually a stream.

```
.text(encoding : string) : Promise
```

Read the response body into a string.

**Returns:**

A `Promise`. Resolves with a `string`. Rejects with an `Error`.


## Plugins and Middleware

Plugin functions are simple functions that take a client instance and do something with it. Plugin functions are called when they are `.use()`d.

Middleware functions are simple functions that take a `Request` or `Response` object and a `next()` callback as parameters, and does something with them. e.g. add helper methods to the `Request` or `Response` objects, modify the headers or body sent or retreived from the server.

### Example

Here's an example plugin that adds a `.error()` method to the `Response` for asserting whether an error occurred with the request.

```javascript
function plugin(client) {
  client.after((res, next) => {
    res.error = () =>
      this.status >= 400 && this.status < 600
    ;
    next(null, res);
  });
}
````

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

## To do

- Tests
- Plugins:
    - Cookie Jar
- Support for XMLHttpRequest/fetch in the browser

## Changelog

### v3.0.0

Almost a total rewrite.

- break: use promises instead of events and callbacks
- break: use middleware instead of events for plugins
- break: use simplified `Request` and `Response` objects

### v2.0.0

 - moved `prefixUrl`, `contentType` and `body` plugins into their own repositories
 - changed the arguments passed to the `before` and `after` event handlers - handlers now receive a formal event object that allows propagation to be stopped and the request to be prevented
 - adding some tests
 - cleaning up documentation

## License

The MIT License (MIT)

Copyright (c) 2016 James Newell