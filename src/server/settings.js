try {
  exports.settings = require('./.settings.js').settings;
} catch (e) {
  exports.settings = {
    httpServer: {},
    staticServer: {},
    matchServer: {},
  }
}