'use strict';

let spawnSync = require('child_process').spawnSync;
let async = require('async');
let browsers = require('../browser-providers.conf.js');
let sauce = require('./sauce.js');

const readline = require('readline');
let rl = readline.createInterface({input: process.stdin, output: process.stdout});


if (!process.env.BUILD || !process.env.TUNNEL_IDENTIFIER) {
  if (process.env.TRAVIS) {
    process.env.BUILD =
        'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    process.env.TUNNEL_IDENTIFIER = process.env.TRAVIS_JOB_NUMBER;
    console.log('\nTRAVIS_PULL_REQUEST=' + process.env.TRAVIS_PULL_REQUEST);
  } else {
    let time = timestamp();
    process.env.BUILD = 'Local (' + time + ')';
    process.env.TUNNEL_IDENTIFIER = 'Local ' + time;
  }
}


/* configuration */

let modes = {
  'client': ['build:client', 's3:upload'],
  'sl_client_test_required': [
    'sauce:open',
    'test:client -- --browsers=' + browsers.saucelabsAliases.CI_TEST_REQUIRED.join(','),
    'sauce:close'
  ],
  'sl_client_test_optional': [
    'sauce:open',
    'test:client -- --browsers=' + browsers.saucelabsAliases.CI_TEST_OPTIONAL.join(','),
    'sauce:close'
  ],
  'server': ['build:server'],
  'server_test': ['test:server'],
  'coverage': ['test:client', 'coveralls'],
  'e2e': ['e2e']
}

if (validMode(process.env.CI_MODE)) {
  execute(modes[process.env.CI_MODE]);
}
else {
  selectMode();
}


function selectMode() {
  console.log('\nSelect one of the following modes you want to run: ');

  let i = 0;
  for (let m in modes) {
    console.log('  ' + i + ' - \'' + m + '\'');
    for (let index in modes[m]) {
      console.log('    * ' + modes[m][index]);
    }
    i++;
  }

  rl.question('\nType in a number: ', (answer) => {
    process.env.CI_MODE = getMode(parseInt(answer));

    if (validMode(process.env.CI_MODE)) {
      execute(modes[process.env.CI_MODE]);
    } else {
      selectMode();
    }
  });
}

function validMode(mode) {
  for (let m in modes) {
    if (mode === m) {
      return true;
    }
  }
  return false;
}

function getMode(index) {
  let i = 0;
  for (let m in modes) {
    if (index === i) {
      return m;
    }
    i++;
  }
  return '';
}


/* execute */

function execute(scripts) {
  console.log('\nStarting \'' + process.env.CI_MODE + '\'..');

  execute_scripts(scripts);
}


// todo: remove this and create npm scripts 'sauce:open' and 'sauce:close'. Currently not possible
// due to sauce_process variable / asyncness.
function execute_scripts(scripts) {
  if (scripts[0] === 'sauce:open') {
    sauce.open(
        function(sauce_process) {
          let status = spawn_processes(scripts.splice(1, scripts.length - 2));
          sauce.close(sauce_process, function() {
            exit(status);
          });
        },
        function() {
          execute_scripts(scripts);
        });
  } else {
    let status = spawn_processes(scripts);
    exit(status);
  }
}

function spawn_processes(scripts) {
  for (let script of scripts) {
    let status = spawn_process(script);
    if (status !== 0) {
      return status;
    }
  }
  return 0;
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


/* misc */

function timestamp(input, length) {
  let time = new Date();
  return time.getFullYear() + '' + pad(time.getMonth()) + '' + pad(time.getDate()) + '' +
      pad(time.getHours()) + '' + pad(time.getMinutes()) + '' + pad(time.getSeconds());
}

function pad(input) {
  return '00'.substring(0, 2 - input.toString().length) + input;
}

function exit(status) {
  rl.pause();

  let message = 'Exit status ' + status;
  if (status === 0) {
    console.log(message);
  } else {
    throw new Error(message);
  }
}
