var browserProvidersConf = require('./browser-providers.conf.js');
var webpackConfig = require('./build/webpack.client.test.js');
var helpers = require('../helpers');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [{pattern: 'karma-test-shim.js', watched: false}],

    port: 9876,
    browsers: ['PhantomJS'],
    concurrency: 1,
    customLaunchers: browserProvidersConf.customLaunchers,
    singleRun: true,
    logLevel: config.LOG_DEBUG,

    plugins: [
      'karma-jasmine', 'karma-webpack', 'karma-sauce-launcher', 'karma-phantomjs-launcher',
      'karma-sourcemap-loader', 'karma-mocha-reporter', 'karma-coverage'
    ],

    preprocessors: {'karma-test-shim.js': ['webpack', 'sourcemap']},

    reporters: ['mocha', 'coverage', 'saucelabs'],

    coverageReporter: {
      dir: '../coverage',
      reporters: [
        {type: 'text-summary'}, {type: 'json'}, {type: 'html'},
        {type: 'lcovonly', subdir: 'lcov'}
      ]
    },

    sauceLabs: {
      build: process.env.BUILD,
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER,
      testName: 'Legend Builder',
      retryLimit: 3,
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        'selenium-version': '2.53.0',
        'command-timeout': 120,
        'idle-timeout': 120,
        'max-duration': 900
      }
    },

    webpack: webpackConfig,
    webpackMiddleware: {stats: 'errors-only'},
    webpackServer: {noInfo: true},

    captureTimeout: 40000,
    browserDisconnectTimeout: 40000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 40000
  });

  if (process.env.TRAVIS) {
    config.hostname = 'karma.com';
  }
};
