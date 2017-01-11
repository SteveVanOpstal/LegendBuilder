let spawn = require('child_process').spawn;
let fs = require('fs');

module.exports = {
  open: () => {
    console.log('SauceLabs: starting ' + process.env.BUILD + '..');

    let command = 'npm';
    if (/^win/.test(process.platform)) {
      command += '.cmd';
    }

    let child = spawn(command, ['run', 'sauce-connect'], {detached: true, stdio: 'ignore'});

    child.on('exit', (status) => {
      process.exit(status);
    });

    child.unref();

    wait_for_file('build/log/' + process.env.BUILD + '.pid');
  },
  close: () => {
    console.log('SauceLabs: stopping..');
    let pid = read_pid('build/log/' + process.env.BUILD + '.pid');
    process.kill(pid);
  }
};

let repeats = 0;
function wait_for_file(path, timeout_seconds) {
  timeout = timeout_seconds ? timeout_seconds : 60;
  fs.open(path, 'r', (err, fd) => {
    if (err) {
      repeats++;
      if (repeats <= timeout) {
        process.stdout.write('.');
        setTimeout(wait_for_file, 1000, path);
      } else {
        repeats = 0;
      }
    }
  });
}

function read_pid(path) {
  let data = fs.readFileSync(path);
  return parseInt(data, 10);
}

if (require.main === module) {
  if (process.argv[2] == '--close') {
    module.exports.close();
  } else {
    module.exports.open();
  }
}
