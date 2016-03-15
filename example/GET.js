'use strict';

const Client = require('..');
const json = require('go-fetch-json');

new Client()
  .use(json())
  .get('http://httpbin.org/get')
  .then(res => {
    console.log(res.toString(), res.isJSON());
    return res.json();
  })
  .then(json => console.log(json))
  .catch(err => console.error(err.stack))
;