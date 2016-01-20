var http = require('http');
var url = require('url');
var fs = require('fs');
var console = require('./console.js');
var host = require('./host.js');

var Lru = require("lru-cache");
var cache = Lru({
  max: 1048000,
  length: function (n) { return n.length * 2; },
  maxAge: 1000 * 60 * 60 * 24
});

var config = {
  liveServer: JSON.parse(fs.readFileSync('.live-server.json', 'utf8')),
  server: JSON.parse(fs.readFileSync('.static-server.json', 'utf8'))
}

host.options(config.server.host, config.server.port);

var headers = {
  'Access-Control-Allow-Origin': 'http://' + (config.liveServer.host || "127.0.0.1") + ':' + (config.liveServer.port || "8080"),
  'content-type': 'application/json'
};

var server = http.createServer(function (request, response) {
  console.start(50);
  
  var requestUrl = url.parse(request.url, true);
  host.transformUrl(requestUrl);
  
  var cachedResponseData = cache.get(request.url);
  
  if(cachedResponseData) {
    response.writeHead(200, headers);
    response.write(cachedResponseData);
    response.end();
    console.logHttp("CACHED", request.url, 200, cache.length / 1000000 + 'MB/' + cache.max / 1000000 + 'MB');
    return;
  }
  
  var path = url.format({ pathname: host.createUrl(requestUrl.pathname), query: requestUrl.query });
  
  host.sendRequest('global', path, function (data, error, status) {
    response.writeHead(status, headers);
    if (data) {
      response.write(data);
      console.logHttp(request.method, request.url, status);
      
      cache.set(request.url, data);
    } else {
      response.write(error + '\n');

      console.logHttp(request.method, request.url, status, error);
    }
    response.end();
  });
})
.listen(config.server.port, config.server.host);

console.log(config.server.host + ':' + config.server.port);