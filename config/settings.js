const helpers = require('../helpers');

var settings = {};
try {
  settings = req('json!./.settings.json');
} catch (e) {
}

module.exports.settings = helpers.merge(settings, {
  httpServer: {
    host: 'localhost',
    port: 8080
  },
  staticServer: {
    host: 'localhost',
    port: 8081
  },
  matchServer: {
    host: 'localhost',
    port: 8082,
    sampleSize: 32
  },
  apiVersions: {
    'summoner': 'v1.4',
    'matchlist': 'v2.2',
    'match': 'v2.2',
    'static-data': 'v1.2',
  },
  gameTime: 60 * 60 * 1000
});
