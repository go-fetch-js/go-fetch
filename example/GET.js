'use strict';

const Client = require('..');
const json = require('go-fetch-json');

new Client()
  .use(json())
  .get('http://httpbin.org/get')
    .then(res => res.json())
    .then(json => console.log(res.toString(), json))
    .catch(err => console.error(err))
;