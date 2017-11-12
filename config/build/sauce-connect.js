let sauceConnectLauncher = require('sauce-connect-launcher');
let http = require('http');

const PORT = process.env.SAUCE_CONNECT_OPEN || 3500;

let server = http.createServer();
let running = false;
let sauce_process;

function close() {
  if (server) {
    console.log('Closing..');
    server.close(() => {
      if (sauce_process) {
        sauce_process.kill();
      }
      console.log('Closed');
    });
    process.exit();
    server = undefined;
  }
}

console.log('Starting..');

sauceConnectLauncher(
    {
      tunnelIdentifier: process.env.TUNNEL_IDENTIFIER,
      verbose: true,
      noSslBumpDomains: 'all',  // android runs into certificate errors due to SSL bumping,
                                // this argument disables SSL bumping on all domains
      logger: (message) => {
        console.log('node-sauce-connect: ' + message);
      }
    },
    (err, sauce) => {
      if (sauce_process) {
        sauce_process = sauce;
        sauce_process.on('exit', (status) => {
          console.log('SauceLabs: stopped (' + status + ')');
          close();
        });
      }

      if (err) {
        console.log('SauceLabs: start failed, \'' + err.message + '\'');
        close();
      } else {
        running = true;
        console.log('SauceLabs: running');
      }
    });

server.on('request', (req, res) => {
  let rawData = '';
  req.on('data', (chunk) => {
    rawData += chunk;
  });
  req.on('end', () => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    if (rawData === 'running?') {
      res.end(running ? 'yes' : 'no');
    } else {
      res.end('okay');
      close();
    }
  });
});

server.listen(PORT);
console.log('listening on port: ' + PORT);
