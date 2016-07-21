module.exports = function(config) {
  var helpers = require('../helpers');
  var specPath = helpers.root('dist/spec/client/main.spec.js');

  config.set({
    frameworks: ['jasmine'],
    files: [{pattern: specPath, watched: false}],

    coverageReporter: {
      dir: '../coverage',
      reporters: [
        {type: 'text-summary'}, {type: 'json'}, {type: 'html'},
        {type: 'lcovonly', subdir: 'lcov'}
      ]
    },
    webpackServer: {noInfo: true},
    reporters: ['mocha', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
