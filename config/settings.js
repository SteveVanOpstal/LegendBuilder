let helpers = require('./helpers');

let settings = {};
try {
  settings = req('json!./.settings.json');
} catch (e) {
}

let exports = helpers.merge(settings, {
  httpServer: {host: 'localhost', port: 8080},
  staticServer: {host: 'localhost', port: 8081},
  matchServer: {host: 'localhost', port: 8082, sampleSize: 32},
  apiVersions: {
    'summoner': 'v1.4',
    'matchlist': 'v2.2',
    'match': 'v2.2',
    'static-data': 'v1.2',
  },
  gameTime: 60 * 60 * 1000
})

exports['settings'] = exports;
module.exports = exports
