var helpers = require('./helpers');

var settings = {};
try {
  settings = require('./settings.json');
} catch (e) {
}

console.log('user settings:');
console.log(settings);

var exportSettings = helpers.merge(settings, {
  host: '127.0.0.1',
  port: 80,
  static: {port: 8081},
  match: {port: 8082, sampleSize: 32},
  apiVersions: {
    'summoner': 'v1.4',
    'matchlist': 'v2.2',
    'match': 'v2.2',
    'static-data': 'v1.2'
  },
  gameTime: 45 * 60 * 1000
});

exportSettings.domain = exportSettings.host + (exportSettings.port ? ':' + exportSettings.port : '')

exportSettings['settings'] = exportSettings;
module.exports = exportSettings;
