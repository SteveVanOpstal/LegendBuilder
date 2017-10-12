var settings = {};
try {
  settings = require('./settings.json');
} catch (e) {
}

var exportSettings = Object.assign(
    {
      host: 'legendbuilder.io',
      port: null,
      static: {port: 8081},
      match: {port: 8082, sampleSize: 32},
      api: {
        regions: ['ru', 'kr', 'pbe1', 'br1', 'oc1', 'jp1', 'na1', 'eun1', 'euw1', 'tr1', 'la1'],
        versions: {'summoner': 'v3', 'match': 'v3', 'static-data': 'v3', 'status': 'v3'},
      },
      gameTime: 45 * 60 * 1000
    },
    settings);

exportSettings.domain = exportSettings.host + (exportSettings.port ? ':' + exportSettings.port : '')

exportSettings['settings'] = exportSettings;
module.exports = exportSettings;
