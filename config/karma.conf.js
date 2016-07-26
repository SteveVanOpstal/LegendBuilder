var browserProvidersConf = require('./browser-providers.conf.js');

module.exports = function(config) {
  var helpers = require('../helpers');
  var specPath = helpers.root('dist/spec/client/main.spec.js');

  config.set({
    frameworks: ['jasmine'],
    files: [{pattern: specPath, watched: false}],
    
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    customLaunchers: browserProvidersConf.customLaunchers,

    plugins: [
      'karma-jasmine',
      'karma-sauce-launcher',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-sourcemap-loader',
      'karma-mocha-reporter',
      'karma-coverage'
    ],
    
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir: '../coverage',
      reporters: [
        {type: 'text-summary'}, {type: 'json'}, {type: 'html'},
        {type: 'lcovonly', subdir: 'lcov'}
      ]
    },
    
    sauceLabs: {
      testName: 'Legend Builder',
      retryLimit: 3,
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        'selenium-version': '2.53.0',
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400
      }
    },

    webpackServer: {noInfo: true}
  });


  if (process.env.TRAVIS) {
    config.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;

    console.log('>>>> setting socket.io transport to polling <<<<');
    config.transports = ['polling'];
  }
};
