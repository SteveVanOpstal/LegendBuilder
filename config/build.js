'use strict';

let spawnSync = require('child_process').spawnSync;
let async = require('async');
let browsers = require('./browser-providers.conf.js');
let sauceConnectLauncher = require('sauce-connect-launcher');

if (!process.env.SAUCE_BUILD || !process.env.SAUCE_TUNNEL_IDENTIFIER) {
  if (process.env.TRAVIS) {
    process.env.SAUCE_BUILD =
        'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    process.env.SAUCE_TUNNEL_IDENTIFIER = process.env.TRAVIS_JOB_NUMBER;
  } else {
    var time = timestamp();
    process.env.SAUCE_BUILD = 'Local (' + time + ')';
    process.env.SAUCE_TUNNEL_IDENTIFIER = 'Local ' + time;
  }
}

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
  open_sauce(function(process) {
    let status = execute_scripts(scripts);
    close_sauce(process, function() {
      exit(status);
    });
  });
} else {
  let status = execute_scripts(scripts);
  exit(status);
}


function execute_scripts(scripts) {
  let status = 0;
  for (let script of scripts) {
    let currentStatus = spawn_process(script);
    status = currentStatus ? currentStatus : status;
  }
  return status;
}

function spawn_process(script) {
  let command = 'npm';
  if (/^win/.test(process.platform)) {
    command += '.cmd';
  }

  console.log('Starting \'npm run ' + script + '\'..');

  let child = spawnSync(command, ['run'].concat(script.split(' ')), {stdio: 'inherit'});

  console.log('Exit status ' + child.status + ' on \'' + script + '\'');

  if (child.error) {
    console.log('Error \'' + child.error + '\' on \'' + script + '\'');
    return child.status === 0 ? 1 : child.status;
  }

  return child.status;
}

function exit(status) {
  let message = 'Exit status ' + status;
  if (status) {
    throw new Error(message);
  } else {
    console.log(message);
  }
}


/* sauce-connect-launcher */

function open_sauce(done) {
  console.log('Sauce: starting ' + process.env.SAUCE_BUILD + '..');
  sauceConnectLauncher(
      {tunnelIdentifier: process.env.SAUCE_TUNNEL_IDENTIFIER}, function(err, process) {
        if (err) {
          throw new Error('Sauce: start failed, \'' + err.message + '\'');
        }
        console.log('Sauce: running');
        done(process);
      });
}

function close_sauce(process, done) {
  console.log('Sauce: stopping..');
  process.close(function() {
    console.log('Sauce: stopped');
    done();
  })
}


/* misc */

function timestamp(input, length) {
  let time = new Date();
  return pad(time.getSeconds()) + '' + pad(time.getMinutes()) + '' + pad(time.getHours()) + '' +
      pad(time.getDate()) + '' + pad(time.getMonth()) + '' + time.getFullYear();
}

function pad(input) {
  return '00'.substring(0, 2 - input.toString().length) + input;
}
