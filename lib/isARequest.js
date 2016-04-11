
module.exports = function(req) {
  return typeof(req) === 'object' && typeof(req.method) === 'string' && typeof(req.url) === 'string' && typeof(req.headers) === 'object';
};
