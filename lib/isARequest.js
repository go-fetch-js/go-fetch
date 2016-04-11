
module.exports = function(req) {
  return req !== null && typeof(req) === 'object' && typeof(req.method) === 'string' && typeof(req.url) === 'string' && typeof(req.headers) === 'object';
};
