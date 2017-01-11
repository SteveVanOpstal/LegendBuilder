let spawn = require('child_process').spawn;
let fs = require('fs');

let path = 'build/log/' + process.env.BUILD + '.pid';

module.exports = {
  open: () => {
    console.log('SauceLabs: starting ' + process.env.BUILD + '..');

    let command = 'npm';
    if (/^win/.test(process.platform)) {
      command += '.cmd';
    }

    let child = spawn(command, ['run', 'sauce-connect'], {detached: true, stdio: 'ignore'});

    child.on('exit', (status) => {
      console.log('SauceLabs: stopped (' + status + ')');
      process.exit(status);
    });

    child.unref();

    console.log(path + ': waiting..');
    wait_for_file(
        path,
        () => {
          console.log('SauceLabs: running');
        },
        () => {
          console.log('SauceLabs: start failed');
          process.exit(1);
        });
  },
  close: () => {
    console.log('SauceLabs: stopping..');
    let pid = read_pid(path);
    process.kill(pid);
  }
};

let repeats = 0;
function wait_for_file(path, done, error) {
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      repeats++;
      if (repeats <= 180) {
        process.stdout.write('.');
        setTimeout(wait_for_file, 1000, path, done, error);
      } else {
        process.stdout.write('\n');
        error();
      }
    } else {
      process.stdout.write('\n');
      console.log(path + ': ready');
      done();
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
