let browserProvidersConfig = require('./browser-providers.conf.js');
let webpackConfig = require('./build/webpack.client.test.js');
let helpers = require('./helpers');

module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    files: [{pattern: 'karma-test-shim.js', watched: false}],

    browsers: ['PhantomJS'],
    concurrency: 1,
    customLaunchers: browserProvidersConfig.customLaunchers,
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
      recordVideo: !process.env.TRAVIS,
      recordScreenshots: !process.env.TRAVIS,
      testName: 'Legend Builder',
      retryLimit: 3,
      startConnect: false,
      options: {
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400,
      }
    },

    webpack: webpackConfig,
    webpackMiddleware: {stats: 'errors-only'},
    webpackServer: {noInfo: true},

    port: 9876,
    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
    browserConsoleLogOptions: { terminal: false }
  });

  if (process.env.TRAVIS) {
    config.hostname = 'karma.com';
  }
};
