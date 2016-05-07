Error.stackTraceLimit = Infinity;

require('core-js');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone.js');
require('zone.js/dist/jasmine-patch.js');


var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.setBaseTestProviders(
  browser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  browser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

Object.assign(global, testing);
var testContext = require.context('./src/app', true, /\.spec\.ts/);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

var modules = requireAll(testContext);

/* jasmine custom matchers */

var jasmineMatchers = require('jasmine-matchers-loader');

jasmineMatchers.add({
  toHaveEqualContent: function(key, actual) {
    return JSON.stringify(key) === JSON.stringify(actual);
  }
});