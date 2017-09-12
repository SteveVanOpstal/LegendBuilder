let browserProvidersConfig = require('./browser-providers.conf.js');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'), require('karma-chrome-launcher'), require('karma-sauce-launcher'),
      require('karma-jasmine-html-reporter'), require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client: {
      clearContext: false  // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {reports: ['html', 'lcovonly'], fixWebpackSourcePaths: true},
    angularCli: {environment: 'dev'},
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
    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
    browserConsoleLogOptions: {terminal: false},
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    concurrency: 1,
    customLaunchers: browserProvidersConfig.customLaunchers,
    singleRun: true,
    logLevel: config.LOG_DEBUG,
  });

  if (process.env.TRAVIS) {
    config.hostname = 'karma.com';
  }
};
