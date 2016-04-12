'use strict';

function toArrayWithoutError(args) {
  const array = Array.prototype.slice.call(args, 0);
  array.shift();
  return array;
}

module.exports = function ware(wares, args, each, done) {
  const originalArgCount = args.length;
  let i = 0;

  const next = function(err) {
    const args = toArrayWithoutError(arguments);

    if (err) {
      return done.apply(null, [].concat(err, args));
    }

    if (i >= wares.length) {
      return done.apply(null, [].concat(null, args));
    }

    wares[i++].apply(null, [].concat(args, function(err) {
      const args = toArrayWithoutError(arguments);
      if (err) {
        done(err);
      } else {

        //check the number of args has remained the same
        if (args.length != originalArgCount) {
          return done(new Error(`Invalid number of args returned by middleware. Got ${args.length} and expected ${originalArgCount}.`))
        }

        each.apply(null, [].concat(args, next, done));
      }
    }));

  };

  setTimeout(() => next.apply(null, [].concat(null, args)), 0);

};
