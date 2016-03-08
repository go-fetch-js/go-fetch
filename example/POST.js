'use-strict';

const Client = require('..');

new Client()
  .post('http://httpbin.org/post', {'content-type': 'application/json'}, JSON.stringify({msg: 'Go fetch!'}))
  .then(res => {
    console.log(res.toString());
    return res.body.json().then(json => console.log(json));
  })
  .catch(err => console.error(err))
;
