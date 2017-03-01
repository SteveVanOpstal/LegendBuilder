let sauceConnectLauncher = require('sauce-connect-launcher');
let fs = require('fs');

create_dir('build');
create_dir('build/log');

retry_counter = 0;

module.exports = {
  sauce_connect: () => {
    sauceConnectLauncher(
        {
          tunnelIdentifier: process.env.TUNNEL_IDENTIFIER,
          logfile: 'build/log/' + process.env.BUILD + '.log',
          verbose: true,
          noSslBumpDomains: 'all'  // android runs into certificate errors due to SSL bumping,
                                   // this argument disables SSL bumping on all domains
        },
        (err, sauce_process) => {
          if (sauce_process) {
            sauce_process.on('exit', (status) => {
              console.log('SauceLabs: stopped (' + status + ')');
              process.exit(status);
            });
          }

          if (err) {
            if (retry_counter <= 10) {
              retry_counter++;
              setTimeout(module.exports.sauce_connect, 6000);
              return;
            }
            console.log('SauceLabs: start failed, \'' + err.message + '\'');
            process.exit(1);
          } else {
            write_pid('build/log/' + process.env.BUILD + '.pid');
            console.log('SauceLabs: running');
          }
        });
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