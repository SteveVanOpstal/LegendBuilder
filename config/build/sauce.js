let sauceConnectLauncher = require('sauce-connect-launcher');
let fs = require('fs');

module.exports = {
  open: function(done, error) {
    console.log('SauceLabs: starting ' + process.env.BUILD + '..');

    // create folder structure
    try {
      fs.mkdirSync('build');
      fs.mkdirSync('build/log');
    } catch (e) {
      if (e.code !== 'EEXIST')
        throw e;
    }

    sauceConnectLauncher(
        {
          tunnelIdentifier: process.env.TUNNEL_IDENTIFIER,
          logfile: 'build/log/' + process.env.BUILD + '.log',
          verbose: true
        },
        function(err, sauce_process) {
          if (err) {
            let message = 'SauceLabs: start failed, \'' + err.message + '\'';
            if (typeof error === 'function') {
              console.log(message);
              error(err);
            } else {
              throw new Error(message);
            }
          } else {
            console.log('SauceLabs: running');
            if (typeof done === 'function') {
              done(sauce_process);
            }
          }
        });
  },
  close: function(sauce_process, done) {
    console.log('SauceLabs: stopping..');

    sauce_process.close(function() {
      console.log('SauceLabs: stopped');
      if (typeof done === 'function') {
        done();
      }
    });
  }
};


if (require.main === module) {
  if (process.argv[2] == '--open') {
    module.exports.open();
  } else if (process.argv[2] == '--close') {
    module.exports.close();
  } else {
    console.log('missing argument:');
    console.log('  * --open');
    console.log('  * --close');
  }
}
