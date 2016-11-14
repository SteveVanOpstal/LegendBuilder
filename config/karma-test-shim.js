Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/core/regexp');
require('reflect-metadata');

require('zone.js/dist/zone');
require('zone.js/dist/proxy');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');

require('rxjs/Rx');
require('./jasmine-matchers');
require('./shims_for_IE');

var appContext = require.context('../src/client', true, /\.spec\.ts/);

appContext.keys().forEach(appContext);

var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(
    browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());