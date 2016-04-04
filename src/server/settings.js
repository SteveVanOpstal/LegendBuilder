try {
  var settings = require('./.settings.js');
} catch (e) {
  var settings = {
    httpServer: {},
    staticServer: {},
    matchServer: {},
  }
}

module.exports.settings = settings;