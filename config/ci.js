'use strict';

let spawnSync = require('child_process').spawnSync;
let async = require('async');
let browsers = require('./browser-providers.conf.js');
let sauceConnectLauncher = require('sauce-connect-launcher');
let fs = require('fs');

const readline = require('readline');
var rl = readline.createInterface({input: process.stdin, output: process.stdout});


if (!process.env.BUILD || !process.env.TUNNEL_IDENTIFIER) {
  if (process.env.TRAVIS) {
    process.env.BUILD =
        'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    process.env.TUNNEL_IDENTIFIER = process.env.TRAVIS_JOB_NUMBER;
  } else {
    var time = timestamp();
    process.env.BUILD = 'Local (' + time + ')';
    process.env.TUNNEL_IDENTIFIER = 'Local ' + time;
  }
}


/* configuration */

var modes = {
  'client': ['build:client'],
  'sl_client_test_required':
      ['test:client -- --browsers=' + browsers.saucelabsAliases.CI_TEST_REQUIRED.join(',')],
  'sl_client_test_optional':
      ['test:client -- --browsers=' + browsers.saucelabsAliases.CI_TEST_OPTIONAL.join(',')],
  'server': ['build:server'],
  'server_test': ['test:server'],
  'coverage': ['test:client', 'coveralls'],
  'e2e': ['e2e']
}

var mode = process.env.CI_MODE;
if (validMode(mode)) {
  execute(modes[mode]);
}
else {
  selectMode();
}


function selectMode() {
  console.log('\nSelect one of the following modes you want to run: ');

  var i = 0;
  for (var m in modes) {
    console.log('  ' + i + ' - \'' + m + '\'');
    for (var index in modes[m]) {
      console.log('    * ' + modes[m][index]);
    }
    i++;
  }

  rl.question('\nType in a number: ', (answer) => {
    mode = getMode(parseInt(answer));

    if (validMode(mode)) {
      execute(modes[mode]);
    } else {
      selectMode();
    }
  });
}

function validMode(mode) {
  for (var m in modes) {
    if (mode === m) {
      return true;
    }
  }
  return false;
}

function getMode(index) {
  var i = 0;
  for (var m in modes) {
    if (index === i) {
      return m;
    }
    i++;
  }
  return '';
}


/* execute */

function execute(scripts) {
  console.log('\nStarting \'' + mode + '\'..');

  if (mode === 'sl_client_test_required' || mode === 'sl_client_test_optional') {
    open_saucelabs(function(process) {
      let status = execute_scripts(scripts);
      close_saucelabs(process, function() {
        exit(status);
      });
    });
  } else {
    let status = execute_scripts(scripts);
    exit(status);
  }
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

  console.log('\nStarting \'npm run ' + script + '\'..');

  let child = spawnSync(command, ['run'].concat(script.split(' ')), {stdio: 'inherit'});

  console.log('\nExit status ' + child.status + ' on \'' + script + '\'');

  if (child.error) {
    console.log('Error \'' + child.error + '\' on \'' + script + '\'');
    return child.status === 0 ? 1 : child.status;
  }

  return child.status;
}


/* saucelabs tunnel */

function open_saucelabs(done) {
  console.log('SauceLabs: starting ' + process.env.BUILD + '..');
  mkdirSync('build/log');
  sauceConnectLauncher({tunnelIdentifier: process.env.TUNNEL_IDENTIFIER, logfile: 'build/log/' + process.env.BUILD + '.log'}, function(err, process) {
    if (err) {
      throw new Error('SauceLabs: start failed, \'' + err.message + '\'');
    }
    console.log('SauceLabs: running');
    done(process);
  });
}

function close_saucelabs(process, done) {
  console.log('SauceLabs: stopping..');
  process.close(function() {
    console.log('SauceLabs: stopped');
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

function exit(status) {
  rl.pause();

  let message = 'Exit status ' + status;
  if (status) {
    throw new Error(message);
  } else {
    console.log(message);
  }
}

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}