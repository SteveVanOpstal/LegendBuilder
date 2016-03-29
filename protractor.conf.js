var settings = require('./src/server/settings').settings;
var helpers = require('./helpers');

var configuration = {
  baseUrl: 'http://' + (settings.httpServer.host || 'localhost') + ':' + (settings.httpServer.port || 8080),

  specs: [
    helpers.root('src/**/*.e2e.ts')
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

  onPrepare: function() {
    browser.ignoreSynchronization = true;
  },

  seleniumServerJar: "node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar",
  useAllAngular2AppRoots: true
};


var BROWSER_CAPS = {
  ChromeDesktop: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['show-fps-counter=true', '--js-flags=--expose-gc'],
      perfLoggingPrefs: {
        'traceCategories': 'v8,blink.console,devtools.timeline,disabled-by-default-devtools.timeline'
      }
    },
    loggingPrefs: {
      performance: 'ALL',
      browser: 'ALL'
    }
  },
  ChromeOnTravis: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['show-fps-counter=true', '--no-sandbox', '--js-flags=--expose-gc'],
      perfLoggingPrefs: {
        'traceCategories': 'v8,blink.console,devtools.timeline,disabled-by-default-devtools.timeline'
      },
      binary: process.env.CHROME_BIN
    },
    loggingPrefs: {
      performance: 'ALL',
      browser: 'ALL'
    }
  },
  Firefox: {
    browserName: 'firefox'
  }
};

if (process.env.TRAVIS) {
  configuration.multiCapabilities = [
    BROWSER_CAPS.ChromeOnTravis
  ];
} else {
  configuration.multiCapabilities = [
    BROWSER_CAPS.ChromeDesktop
  ];
}

// configuration.multiCapabilities.push(BROWSER_CAPS.Firefox);

exports.config = configuration;