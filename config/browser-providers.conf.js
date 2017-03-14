// Unique place to configure the browsers which are used in the different CI jobs in Sauce Labs (SL).
// If the target is set to null, then the browser is not run anywhere during CI.
var CIconfiguration = {
  'ChromeBeta':   { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'Chrome':       { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'Chrome-1':     { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'FirefoxBeta':  { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'Firefox':      { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'Firefox-1':    { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'IE':           { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'IE-1':         { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: false}},
  'IE-2':         { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: false}},
  'Edge':         { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'Android':      { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'Android-1':    { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: false}},
  'Android-2':    { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: false}},
  'Safari':       { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'Safari-1':     { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: false}},
  'Safari-2':     { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: false}},
  'iOS':          { unitTest: {target: 'SL', required: true }, e2e: {target: null, required: false}},
  'iOS-1':        { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: false}},
  'iOS-2':        { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: false}}
};

var customLaunchers = {
  'SL_CHROMEBETA': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'beta'
  },
  'SL_CHROME': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '56'
  },
  'SL_CHROME-1': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '55'
  },
  'SL_FIREFOXBETA': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'beta'
  },
  'SL_FIREFOX': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '51'
  },
  'SL_FIREFOX-1': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '50'
  },
  'SL_SAFARI': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.12',
    version: '10.0'
  },
  'SL_SAFARI-1': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.11',
    version: '9'
  },
  'SL_SAFARI-2': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10',
    version: '8'
  },
  'SL_IOS': {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '10.0'
  },
  'SL_IOS-1': {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '9.1'
  },
  'SL_IOS-2': {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '8.4'
  },
  'SL_IE': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '11'
  },
  'SL_IE-1': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
  },
  'SL_IE-2': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9'
  },
  'SL_EDGE': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: 'latest'
  },
  'SL_ANDROID': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: 'latest'
  },
  'SL_ANDROID-1': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: 'latest-1'
  },
  'SL_ANDROID-2': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: 'latest-2'
  }
};

var saucelabsAliases = {
  'ALL': Object.keys(customLaunchers).filter(function(item) {return customLaunchers[item].base == 'SauceLabs';}),
  'CI_TEST_REQUIRED': buildConfiguration('unitTest', 'SL', true),
  'CI_TEST_OPTIONAL': buildConfiguration('unitTest', 'SL', false),
  'CI_E2E_REQUIRED': buildConfiguration('e2e', 'SL', true),
  'CI_E2E_OPTIONAL': buildConfiguration('e2e', 'SL', false)
};

module.exports = {
  customLaunchers: customLaunchers,
  saucelabsAliases: saucelabsAliases,
};

function buildConfiguration(type, target, required) {
  return Object.keys(CIconfiguration)
    .filter((item) => {
      var conf = CIconfiguration[item][type];
      return conf.required === required && conf.target === target;
    })
    .map((item) => {
      return target + '_' + item.toUpperCase();
    });
}