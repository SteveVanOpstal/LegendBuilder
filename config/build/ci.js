'use strict';

let spawn = require('child_process').spawn;
let browsers = require('../browser-providers.conf.js');

const readline = require('readline');
let rl = readline.createInterface({input: process.stdin, output: process.stdout});

if (!process.env.BUILD || !process.env.TUNNEL_IDENTIFIER) {
  if (process.env.TRAVIS) {
    process.env.BUILD =
        'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    process.env.TUNNEL_IDENTIFIER = process.env.TRAVIS_JOB_NUMBER;
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
  'coverage': ['test:client', 'coverage'],
  'e2e': ['e2e']
}

for (let index of browsers.saucelabsAliases.ALL) {
  let browser = browsers.customLaunchers[index];
  modes
      [index + ' (' + browser.browserName + ' ' + browser.version + ')' +
       (browser.platform ? '(' + browser.platform + ')' : '')] =
          ['sauce:open', 'test:client -- --browsers=' + index, 'sauce:close'];
}

if (validMode(process.env.CI_MODE)) {
  execute(modes[process.env.CI_MODE]);
} else {
  selectMode();
}

function selectMode() {
  console.log('\nSelect one of the following modes you want to run: ');

  let i = 0;
  for (let m in modes) {
    console.log('  ' + i + '. ' + m);
    if (process.argv[2] == '-m' || process.argv[2] == '--mode_details') {
      for (let index in modes[m]) {
        console.log('    * ' + modes[m][index]);
      }
    }
    i++;
  }

  rl.question('\nType in a number: ', (answer) => {
    process.env.CI_MODE = getMode(parseInt(answer));
    rl.pause();

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

  spawn_processes(scripts);
}

function spawn_processes(scripts) {
  let script = scripts.shift();
  if (!script) {
    exit(0);
  } else {
    spawn_process(
        script,
        () => {
          spawn_processes(scripts);
        },
        (status) => {
          if (status) {
            exit(status);
          } else {
            console.log('Exit status unknown');
            process.exit(1);
          }
        });
  }
}

function spawn_process(script, cb_done, cb_error) {
  let command = 'npm';
  if (/^win/.test(process.platform)) {
    command += '.cmd';
  }

  console.log('\nStarting \'npm run ' + script + '\'..');

  let child = spawn(command, ['run'].concat(script.split(' ')), {stdio: 'inherit'});

  child.on('exit', (status) => {
    console.log('\nExit status ' + status + ' on \'' + script + '\'');
    if (status === 0) {
      cb_done();
    } else {
      cb_error(status);
    }
  });

  child.on('error', (error) => {
    console.log('Error \'' + error + '\' on \'' + script + '\'');
    cb_error();
  });
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
  console.log('Exit status ' + status);
  process.exit(status);
}
