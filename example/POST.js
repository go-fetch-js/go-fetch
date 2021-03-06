'use strict';

const Client = require('..');
const json = require('go-fetch-json');

new Client()
  .use(json())
  .post('http://httpbin.org/post', {msg: 'Go fetch!'})
  .then(res => {
    console.log(res.toString(), res.isJSON());
    return res.json();
  })
  .then(json => console.log(json))
  .catch(err => console.error(err.stack))
;

