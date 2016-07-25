'use strict';

let spawn = require('child_process').spawn;
let async = require('async');
let fs = require('fs');
let config = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
let browsers = require('./browser-providers.conf.js');


/* configuration */

let commands = [];

switch (process.env.CI_MODE) {
  case 'client':
    commands.push('build:client');
    break;

  case 'client_test_required':
    commands.push('test:client');
    config.scripts['test:client'] += ' --browsers=' + browsers.sauceAliases.CI_REQUIRED.join(',');
    break;

  case 'client_test_optional':
    commands.push('test:client');
    config.scripts['test:client'] += ' --browsers=' + browsers.sauceAliases.CI_OPTIONAL.join(',');
    break;

  case 'server':
    commands.push('build:server');
    break;

  case 'server_test':
    commands.push('test:server');
    break;

  case 'e2e':
    commands.push('e2e');
    break;

  default:
    commands.push('build');
    commands.push('test');
    break;
}

/* translate scripts */

let scripts = {};

for (let name in config.scripts) {
  let script = config.scripts[name];
  script = script.split('&&');
  scripts[name] = [];
  for (let subScript of script) {
    subScript = subScript.trim().split(' ');
    let command = subScript[0];
    // windows workaround
    if (/^win/.test(process.platform)) {
      command += '.cmd';
    }
    scripts[name].push({command: command, args: subScript.splice(1)});
  }
}

/* execute */

execute_commands(commands);

function execute_commands(commands, index) {
  index = index ? index : 0;
  let name = commands[index];
  spawn_processes(name, scripts[name], function() {
    index++;
    if (commands[index]) {
      execute_commands(commands, index);
    }
  });
}

function spawn_processes(name, scripts, done, index) {
  index = index ? index : 0;
  spawn_process(name, scripts[index], function() {
    index++;
    if (scripts[index]) {
      spawn_processes(name, scripts, done, index);
    } else {
      done();
    }
  });
}

function spawn_process(name, script, done) {
  let child = spawn(script.command, script.args);

  console.log('Starting `' + name + '`..');

  child.stdout.on('data', function(chunk) {
    console.log(chunk.toString());
  });

  child.stderr.on('data', function(chunk) {
    console.log(chunk.toString());
  });

  child.on('error', (err) => {
    console.log('Error `' + err + '` on `' + name + '`');
    done();
  });

  child.on('exit', (code) => {
    console.log('Exit code `' + code + '` on `' + name + '`');
    done();
  });
}
