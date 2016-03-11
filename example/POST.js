'use strict';

const Client = require('..');
const json = require('go-fetch-json');

new Client()
  .use(json())
  .post('http://httpbin.org/post', {msg: 'Go fetch!'})
    .then(res => res.json())
    .then(json => console.log(res.toString(), json))
    .catch(err => console.error(err))
;

