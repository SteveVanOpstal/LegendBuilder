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
      process.stdout.write('\n');
      console.log('SauceLabs: stopped (' + status + ')');
      process.exit(status);
    });

    child.unref();

    wait_for_file(
        'build/log/' + process.env.BUILD + '.pid',
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
    let pid = read_pid('build/log/' + process.env.BUILD + '.pid');
    process.kill(pid);
  }
};

function wait_for_file(path, done, error) {
  console.log(path + ': waiting..');
  pol_file(path, () => {
    console.log(path + ': ready');
  }, error);
}

let repeats = 0;
function pol_file(path, done, error) {
  let retry = 1000;
  let timeout = 180;
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      repeats++;
      if (repeats <= timeout) {
        process.stdout.write('.');
        setTimeout(pol_file, retry, path, done, error);
      } else {
        process.stdout.write('\n');
        error();
      }
    } else {
      process.stdout.write('\n');
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
