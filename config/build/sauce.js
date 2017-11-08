let http = require('http');

const PORT = process.env.SAUCE_CONNECT_PORT || 3500;
const TIMEOUT_S = process.env.SAUCE_CONNECT_TIMEOUT || 60;
const RETRIES = process.env.SAUCE_CONNECT_RETRIES || 5;

function open_sauce_connect(complete, error) {
  let spawn = require('child_process').spawn;

  let command = 'npm';
  if (/^win/.test(process.platform)) {
    command += '.cmd';
  }

  let child = spawn(command, ['run', 'sauce-connect'], {detached: true, stdio: 'ignore'});

  let active = true;
  function close() {
    active = false;
  }

  child.on('exit', () => {
    close();
  });

  attempts = 0;
  function running() {
    if (attempts >= TIMEOUT_S) {
      console.log('');
      console.log('Unable to connect after [' + TIMEOUT_S + '] seconds.');
      return false;
    }
    if (!active) {
      console.log('');
      console.log('Sauce connect process stopped running.');
      return false;
    }
    return true;
  }

  function finish() {
    console.log('Start testing');
    child.unref();
    if (complete) {
      complete();
    }
  }

  function sendRequest(cb) {
    const req = http.request(
        {hostname: 'localhost', port: PORT, method: 'POST', connection: 'close', agent: false},
        (res) => {
          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });
          res.on('end', () => {
            if (rawData === 'yes') {
              console.log('!');
              finish();
            } else {
              cb();
            }
          });
        });
    req.on('error', (e) => {
      cb();
    });
    req.write('running?');
    req.end();
  }

  function ping() {
    process.stdout.write('.');
    if (running()) {
      setTimeout(function() {
        sendRequest(ping);
      }, 1000);
    } else {
      if (error) {
        error();
      }
      child.unref();
      child.kill();
    }

    attempts += 1;
  }

  ping();
}

module.exports = {
  open: (complete, error) => {
    let attempts = 1;
    function sauce_connect_error() {
      attempts += 1;
      if (attempts <= RETRIES) {
        console.log('Attempt [' + attempts + '/' + RETRIES + ']');
        open_sauce_connect(complete, sauce_connect_error);
        if (error) {
          error();
        }
      }
    }

    open_sauce_connect(complete, sauce_connect_error);
  },
  close: () => {
    const req = http.request(
        {hostname: 'localhost', port: PORT, method: 'GET', connection: 'close', agent: false},
        (res) => {
          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });
          res.on('end', () => {
            console.log('Response: ' + rawData);
          });
        });
    req.on('error', (e) => {
      console.log(e);
    });
    req.end();
  }
};

if (require.main === module) {
  if (process.argv[2] == '--close') {
    module.exports.close();
  } else {
    module.exports.open();
  }
}
