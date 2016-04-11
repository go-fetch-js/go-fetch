'use strict';

const Client = require('..');
const client = new Client();

client

	.before((req, next) => {
    console.log('\n======================\nbefore:\n\n' + req.toString());
    next(null, req);
  })

  .after(parseBody)

	.after((res, next) => {
    console.log('\n======================\nafter:\n\n' + res.toString());
    next(null, res);
  })

	.get('http://httpbin.org/html')

    .then(
      res => console.log('\n======================\ndone:\n\n' + res.toString()),
      err => console.log(err)
    )

;

function parseBody(res, next) {
  let body = '';

  res.body.on('data', function (data) {
    body += data.toString();
  });

  res.body.on('end', function () {
    res.body = body;
    next(null, res);
  });

}