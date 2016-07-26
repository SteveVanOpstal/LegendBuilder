'use strict';

let spawnSync = require('child_process').spawnSync;
let async = require('async');
let browsers = require('./browser-providers.conf.js');

var SauceTunnel = require('sauce-tunnel');
var tunnel = new SauceTunnel(
    process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESSKEY, process.env.TRAVIS_JOB_NUMBER);

/* configuration */

let scripts = [];

switch (process.env.CI_MODE) {
  case 'client':
    scripts.push('build:client');
    break;

  case 'client_test_required':
    scripts.push('test:client -- --browsers=' + browsers.sauceAliases.CI_REQUIRED.join(','));
    scripts.push('coveralls');
    break;

  case 'client_test_optional':
    scripts.push('test:client -- --browsers=' + browsers.sauceAliases.CI_OPTIONAL.join(','));
    break;

  case 'server':
    scripts.push('build:server');
    break;

  case 'server_test':
    scripts.push('test:server');
    break;

  case 'e2e':
    scripts.push('e2e');
    break;

  default:
    scripts.push('build');
    scripts.push('test');
    break;
}

/* execute */

if (process.env.CI_MODE === 'client_test_required' ||
    process.env.CI_MODE === 'client_test_optional') {
  open_sauce_tunnel(function() {
    execute_scripts(scripts);
    close_sauce_tunnel();
  });
} else {
  execute_scripts(scripts);
}


function execute_scripts(scripts) {
  for (let script of scripts) {
    spawn_process(script);
  }
}

function spawn_process(script) {
  let command = 'npm';
  if (/^win/.test(process.platform)) {
    command += '.cmd';
  }

  console.log('Starting `npm run ' + script + '`..');

  let child = spawnSync(command, ['run'].concat(script.split(' ')), {stdio: 'inherit'});

  console.log('Exit code ' + child.status + ' on \'' + script + '\'');
  if (child.status !== 0) {
    close_sauce_tunnel();
    process.exit(child.status);
  }

  if (child.error) {
    console.log('Error \'' + error + '\' on \'' + script + '\'');
    close_sauce_tunnel();
    process.exit(1);
  }
}


/* sauce-tunnel */

function open_sauce_tunnel(done) {
  console.log('Sauce tunnel: starting..');
  tunnel.start(function(status) {
    if (!status) {
      console.log('Sauce tunnel: start failed');
      process.exit(1);
    } else {
      console.log('Sauce tunnel: started');
      done();
    }
  });
}

function close_sauce_tunnel() {
  tunnel.stop(function() {
    console.log('Sauce tunnel: stopped');
  });
}
