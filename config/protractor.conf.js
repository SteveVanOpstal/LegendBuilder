var settings = require('./settings');
var helpers = require('./helpers');

var BROWSER_CAPS = {
  Chrome: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['show-fps-counter=true', '--js-flags=--expose-gc'],
      perfLoggingPrefs: {
        traceCategories: 'v8,blink.console,devtools.timeline,disabled-by-default-devtools.timeline'
      }
    },
    loggingPrefs: {performance: 'ALL', browser: 'ALL'}
  },
  Firefox: {browserName: 'firefox'}
};

exports.config = {
  baseUrl: 'http://' + settings.httpServer.host + ':' + settings.httpServer.port,

  specs: [helpers.root('src/**/*.e2e.ts')],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  directConnect: true,

  multiCapabilities: [BROWSER_CAPS.Firefox, BROWSER_CAPS.Chrome],

  onPrepare: () => {
    browser.ignoreSynchronization = true;
  },

  useAllAngular2AppRoots: true
};
