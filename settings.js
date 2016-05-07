var settings = { httpServer: {}, staticServer: {}, matchServer: {} };
try {
  settings = req('./.settings.json');
}
catch(e){}

module.exports.settings = {
  httpServer: {
    host: settings.httpServer.host || 'localhost',
    port: settings.httpServer.port || 8080
  },
  staticServer: {
    host: settings.staticServer.host || 'localhost',
    port: settings.staticServer.port || 8081
  },
  matchServer: {
    host: settings.matchServer.host || 'localhost',
    port: settings.matchServer.port || 8082
  },
  apiVersions: {
    'summoner': 'v1.4',
    'matchlist': 'v2.2',
    'match': 'v2.2',
    'static-data': 'v1.2',
  }
};
