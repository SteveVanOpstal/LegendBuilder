try {
  var settings = require('./.settings.json');
} catch (e) {
  var settings = {
    httpServer: {},
    staticServer: {},
    matchServer: {},
  }
}

module.exports.settings = settings;