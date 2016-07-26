'use strict';

let spawnSync = require('child_process').spawnSync;
let async = require('async');
let browsers = require('./browser-providers.conf.js');


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

execute_scripts(scripts);

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

  console.log('Exit code `' + child.status + '` on `' + script + '`');
  if (child.status !== 0) {
    process.exit(child.status);
  }

  if (child.error) {
    console.log('Error `' + error + '` on `' + script + '`');
    process.exit(1);
  }
}
