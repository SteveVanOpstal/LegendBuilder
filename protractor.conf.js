var httpServer = require('./src/server/.settings').httpServer;
//require('ts-node/register');
var helpers = require('./helpers');

exports.config = {
  baseUrl: 'http://' + (httpServer.host || 'localhost') + ':' + (httpServer.port || 8080),

  specs: [
    helpers.root('src/tests/**.e2e.ts'),
    helpers.root('src/tests/*.e2e.ts')
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['show-fps-counter=true']
    }
  },

  onPrepare: function() {
    browser.ignoreSynchronization = true;
  },

  seleniumServerJar: "node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar",
   useAllAngular2AppRoots: true
};
