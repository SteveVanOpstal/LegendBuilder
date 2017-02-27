let helpers = require('./helpers');

let settings = {};
try {
  settings = req('json!./.settings.json');
} catch (e) {
}

module.exports['settings'] = helpers.merge(settings, {
  httpServer: {host: 'localhost', port: 8080},
  staticServer: {host: 'localhost', port: 8081},
  matchServer: {host: 'localhost', port: 8082, sampleSize: 32},
  apiVersions: {
    'summoner': 'v1.4',
    'matchlist': 'v2.2',
    'match': 'v2.2',
    'static-data': 'v1.2',
  },
  gameTime: 45 * 60 * 1000
});
