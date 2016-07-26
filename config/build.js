'use strict';

let spawn = require('child_process').spawn;
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

function execute_scripts(scripts, index) {
  index = index ? index : 0;
  spawn_process(scripts[index], function() {
    index++;
    if (scripts[index]) {
      execute_scripts(scripts, index);
    }
  });
}

function spawn_process(script, done) {
  let command = 'npm';
  if (/^win/.test(process.platform)) {
    command += '.cmd';
  }

  console.log('Starting `' + script + '`..');

  let child = spawn(command, ['run'].concat(script.split(' ')));

  child.stdout.on('data', function(chunk) {
    console.log(chunk.toString());
  });

  child.stderr.on('data', function(chunk) {
    console.log(chunk.toString());
  });

  child.on('error', (err) => {
    console.log('Error `' + err + '` on `' + script + '`');
    done();
  });

  child.on('exit', (code) => {
    console.log('Exit code `' + code + '` on `' + script + '`');
    done();
  });
}
