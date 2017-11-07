var sauceConnect = require('node-sauce-connect');
var childProcess = require('child_process');
let fs = require('fs');

create_dir('build');
create_dir('build/log');

function logger(data) {
  data = data.toString();
  if (/Sauce Connect is up, you may start your tests./.test(data)) {
    write_pid('build/log/' + process.env.BUILD + '.pid');
  }
  console.log(data);
}

var args = [];

module.exports = {
  sauce_connect: () => {
    sauceConnect.start(args);
    console.log('starting');

    sauceConnect.defaultInstance.stdout.on('data', logger);
    sauceConnect.defaultInstance.on('data', logger);
  }
};


function create_dir(path) {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
}

function write_pid(path) {
  fd = fs.openSync(path, 'w');
  fs.writeSync(fd, process.pid);
}

if (require.main === module) {
  module.exports.sauce_connect();
}
