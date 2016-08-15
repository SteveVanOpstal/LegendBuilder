let sauceConnectLauncher = require('sauce-connect-launcher');

/* saucelabs tunnel */

module.exports = {
  open: function(done) {
    console.log('SauceLabs: starting ' + process.env.BUILD + '..');
    mkdirSync('build');
    mkdirSync('build/log');
    sauceConnectLauncher(
        {
          tunnelIdentifier: process.env.TUNNEL_IDENTIFIER,
          logfile: 'build/log/' + process.env.BUILD + '.log',
          verbose: true
        },
        function(err, process) {
          if (err) {
            throw new Error('SauceLabs: start failed, \'' + err.message + '\'');
          }
          console.log('SauceLabs: running');
          done(process);
        });
  },
  close: function(process, done) {
    console.log('SauceLabs: stopping..');
    process.close(function() {
      console.log('SauceLabs: stopped');
      done();
    })
  }
};
