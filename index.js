var basecamp = require('./lib/basecamp');

module.exports = function(url, apiKey) {
  return new basecamp(url, apiKey);
}