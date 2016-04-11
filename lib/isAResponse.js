
module.exports = function(res) {
  return res !== null && typeof(res) === 'object' && typeof(res.status) === 'number' && typeof(res.reason) === 'string' && typeof(res.headers) === 'object';
};
