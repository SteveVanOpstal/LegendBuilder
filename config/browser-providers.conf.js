// Unique place to configure the browsers which are used in the different CI jobs in Sauce Labs (SL).
// If the target is set to null, then the browser is not run anywhere during CI.
// If a category becomes empty (e.g. BS and required), then the corresponding job must be commented out in Travis configuration.
var CIconfiguration = {
  'Chrome':       { unitTest: {target: 'SL', required: true}, e2e: {target: null, required: true}},
  'Firefox':      { unitTest: {target: 'SL', required: true}, e2e: {target: null, required: true}},
  // FirefoxBeta and ChromeBeta should be target:'SL', and required:true
  // Currently deactivated due to https://github.com/angular/angular/issues/7560
  'ChromeBeta':   { unitTest: {target: null, required: true}, e2e: {target: null, required: false}},
  'FirefoxBeta':  { unitTest: {target: null, required: false}, e2e: {target: null, required: false}},
  'ChromeDev':    { unitTest: {target: null, required: true}, e2e: {target: null, required: true}},
  'FirefoxDev':   { unitTest: {target: null, required: true}, e2e: {target: null, required: true}},
  'IE9':          { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'IE10':         { unitTest: {target: 'SL', required: true}, e2e: {target: null, required: true}},
  'IE11':         { unitTest: {target: 'SL', required: true}, e2e: {target: null, required: true}},
  'Edge':         { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'Android4.1':   { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'Android4.2':   { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'Android4.3':   { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'Android4.4':   { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'Android5':     { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'Safari7':      { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'Safari8':      { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'Safari9':      { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'iOS7':         { unitTest: {target: 'SL', required: true}, e2e: {target: null, required: true}},
  'iOS8':         { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'iOS9':         { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'WindowsPhone': { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}}
};

var customLaunchers = {
  'DartiumWithWebPlatform': {
    base: 'Dartium',
    flags: ['--enable-experimental-web-platform-features'] },
  'ChromeNoSandbox': {
    base: 'Chrome',
    flags: ['--no-sandbox'] },
  'SL_CHROME': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '50'
  },
  'SL_CHROMEBETA': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'beta'
  },
  'SL_CHROMEDEV': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'dev'
  },
  'SL_FIREFOX': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '45'
  },
  'SL_FIREFOXBETA': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'beta'
  },
  'SL_FIREFOXDEV': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'dev'
  },
  'SL_SAFARI7': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.9',
    version: '7'
  },
  'SL_SAFARI8': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10',
    version: '8'
  },
  'SL_SAFARI9': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.11',
    version: '9.0'
  },
  'SL_IOS7': {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '7.1'
  },
  'SL_IOS8': {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '8.4'
  },
  'SL_IOS9': {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '9.1'
  },
  'SL_IE9': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2008',
    version: '9'
  },
  'SL_IE10': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2012',
    version: '10'
  },
  'SL_IE11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  'SL_EDGE': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '13.10586'
  },
  'SL_ANDROID4.1': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.1'
  },
  'SL_ANDROID4.2': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.2'
  },
  'SL_ANDROID4.3': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.3'
  },
  'SL_ANDROID4.4': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.4'
  },
  'SL_ANDROID5': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '5.1'
  }
};

var sauceAliases = {
  'ALL': Object.keys(customLaunchers).filter(function(item) {return customLaunchers[item].base == 'SauceLabs';}),
  'DESKTOP': ['SL_CHROME', 'SL_FIREFOX', 'SL_IE9', 'SL_IE10', 'SL_IE11', 'SL_EDGE', 'SL_SAFARI7', 'SL_SAFARI8', 'SL_SAFARI9'],
  'MOBILE': ['SL_ANDROID4.1', 'SL_ANDROID4.2', 'SL_ANDROID4.3', 'SL_ANDROID4.4', 'SL_ANDROID5', 'SL_IOS7', 'SL_IOS8', 'SL_IOS9'],
  'ANDROID': ['SL_ANDROID4.1', 'SL_ANDROID4.2', 'SL_ANDROID4.3', 'SL_ANDROID4.4', 'SL_ANDROID5'],
  'IE': ['SL_IE9', 'SL_IE10', 'SL_IE11'],
  'IOS': ['SL_IOS7', 'SL_IOS8', 'SL_IOS9'],
  'SAFARI': ['SL_SAFARI7', 'SL_SAFARI8', 'SL_SAFARI9'],
  'BETA': ['SL_CHROMEBETA', 'SL_FIREFOXBETA'],
  'DEV': ['SL_CHROMEDEV', 'SL_FIREFOXDEV'],
  'CI_REQUIRED': buildConfiguration('unitTest', 'SL', true),
  'CI_OPTIONAL': buildConfiguration('unitTest', 'SL', false)
};

module.exports = {
  customLaunchers: customLaunchers,
  sauceAliases: sauceAliases
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