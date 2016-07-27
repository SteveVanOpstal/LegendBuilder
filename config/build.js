'use strict';

let spawnSync = require('child_process').spawnSync;
let async = require('async');
let browsers = require('./browser-providers.conf.js');
var sauceConnectLauncher = require('sauce-connect-launcher');

/* configuration */

let scripts = [];
console.log('Starting \'' + process.env.CI_MODE + '\'..');

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
  open_sauce_connect(function(process) {
    let status = execute_scripts(scripts);
    close_sauce_connect(process);
    if (status) {
      throw new Error('Exit status ' + status);
    }
  });
} else {
  let status = execute_scripts(scripts);
  if (status) {
    throw new Error('Exit status ' + status);
  }
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

  console.log('Starting \'npm run ' + script + '\'..');

  let child = spawnSync(command, ['run'].concat(script.split(' ')), {stdio: 'inherit'});

  console.log('Exit code ' + child.status + ' on \'' + script + '\'');

  if (child.error) {
    console.log('Error \'' + child.error + '\' on \'' + script + '\'');
    return child.status === 0 ? 1 : child.status;
  }

  return child.status;
}


/* sauce-connect-launcher */

function open_sauce_connect(done) {
  console.log('Sauce connect: starting..');
  sauceConnectLauncher({tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER}, function(err, process) {
    if (err) {
      throw new Error('Sauce connect: start failed, \'' + err.message + '\'');
    }
    console.log('Sauce connect: running');
    done(process);
  });
}

function close_sauce_connect(process) {
  process.close(function() {
    console.log('Sauce connect: stopped');
  })
}
