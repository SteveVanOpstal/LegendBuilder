var http = require('http');
var url = require('url');
var fs = require('fs');
var console = require('./console.js');
var host = require('./host.js');

var Lru = require("lru-cache");
var cache = Lru({
  max: 1048000,
  length: function(n) { return n.length * 2; },
  maxAge: 1000 * 60 * 60 * 24
});

var config = {
  server: require('./.settings.js').staticServer
}

config.server.host = config.server.host || "localhost";
config.server.port = config.server.port || 8081;

host.options(config.server.host, config.server.port);

var server = http.createServer(function(request, response) {
  console.start(50);

  var requestUrl = url.parse(request.url, true);
  host.transformUrl(requestUrl);

  var cachedResponseData = cache.get(request.url);

  if (cachedResponseData) {
    response.writeHead(200, host.headers);
    response.write(cachedResponseData);
    response.end();
    console.logHttp("CACHED", request.url, 200, cache.length / 1000000 + 'MB/' + cache.max / 1000000 + 'MB');
    return;
  }

  var path = url.format({ pathname: host.createUrl(requestUrl.pathname), query: requestUrl.query });

  host.sendRequest('global', path, function(data, error, status) {
    response.writeHead(status, host.headers);
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