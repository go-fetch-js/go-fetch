'use strict';

const Client = require('..');
const json = require('go-fetch-json');

new Client()
  .before((req, next) => next(null, new Client.Response({status: 200, body: 'Hello World!'})))
  .use(json())
  .get('http://httpbin.org/get')
  .then(res => {
    console.log(res.toString(), res.isJSON());
    return res.text();
  })
  .then(json => console.log(json))
  .catch(err => console.error(err.stack))
;