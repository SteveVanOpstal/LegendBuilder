let sauce = require('node-sauce-connect');
let http = require('http');

const PORT = process.env.SAUCE_CONNECT_OPEN || 3500;

let server = http.createServer();
let running = false;

function close() {
  if (server) {
    console.log('Closing..');
    server.close(() => {
      sauce.stop();
      console.log('Closed');
    });
    server = undefined;
  }
}

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

sauce.start([]);
console.log('Starting..');

function data(data) {
  data = data.toString();
  if (/Error/.test(data)) {
    error(data);
  } else {
    process.stdout.write('node-sauce-connect: ' + data.toString());
  }
  if (/Sauce Connect is up, you may start your tests./.test(data)) {
    running = true;
  }
}

function error(error) {
  process.stdout.write('node-sauce-connect: ' + error.toString());
  close();
}

sauce.defaultInstance.stdout.on('data', data);
sauce.defaultInstance.on('data', data);
sauce.defaultInstance.stdout.on('error', error);
sauce.defaultInstance.on('error', error);

server.listen(PORT);
console.log('listening on port: ' + PORT);
