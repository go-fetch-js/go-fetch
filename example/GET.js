'use-strict';

const Client = require('..');

new Client()
  .get('http://httpbin.org/get')
    .then(res => {
      console.log(res.toString());
      return res.body.json().then(json => console.log(json));
    })
    .catch(err => console.error(err))
;
