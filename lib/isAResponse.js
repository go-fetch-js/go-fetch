
module.exports = function(res) {
  return typeof(res) === 'object' && typeof(res.status) === 'number' && typeof(res.reason) === 'string' && typeof(res.headers) === 'object';
};
