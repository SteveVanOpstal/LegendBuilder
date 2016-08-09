var browserProvidersConf = require('./browser-providers.conf.js');
var helpers = require('../helpers');
var specPath = helpers.root('dist/spec/client/main.spec.js');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [{pattern: specPath, watched: false}],

    port: 9876,
    browsers: ['PhantomJS'],
    concurrency: 1,
    customLaunchers: browserProvidersConf.customLaunchers,
    singleRun: true,
    logLevel: config.LOG_DEBUG,

    plugins: [
      'karma-jasmine', 'karma-sauce-launcher', 'karma-chrome-launcher', 'karma-phantomjs-launcher',
      'karma-sourcemap-loader', 'karma-mocha-reporter', 'karma-coverage'
    ],

    preprocessors: {specPath: ['sourcemap']},

    reporters: ['mocha', 'coverage', 'saucelabs'],

    coverageReporter: {
      dir: '../coverage',
      reporters: [
        {type: 'text-summary'}, {type: 'json'}, {type: 'html'},
        {type: 'lcovonly', subdir: 'lcov'}
      ]
    },

    sauceLabs: {
      build: process.env.SAUCE_BUILD,
      tunnelIdentifier: process.env.SAUCE_TUNNEL_IDENTIFIER,
      testName: 'Legend Builder',
      retryLimit: 3,
      startConnect: false,
      recordVideo: true,
      recordScreenshots: true,
      options: {
        'selenium-version': '2.53.0',
        'command-timeout': 120,
        'idle-timeout': 120,
        'max-duration': 900
      }
    },

    webpackServer: {noInfo: true},

    captureTimeout: 40000,
    browserDisconnectTimeout: 40000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 40000
  });


};
