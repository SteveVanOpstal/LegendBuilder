let spawn = require('child_process').spawn;

let command = 'npm';
if (/^win/.test(process.platform)) {
  command += '.cmd';
}

let servers = ['server', 'static-server', 'match-server'];

for (let server of servers) {
  spawn_process(server);
}

function spawn_process(script) {
  console.log('Starting \'npm run ' + script + '\'..');
  let child = spawn(command, ['run', script], {detached: true, stdio: 'ignore'});
  child.unref();
}
