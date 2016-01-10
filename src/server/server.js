var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var console = require('./console.js');

var Lru = require("lru-cache");
var cache = Lru({
  max: 1048000,
  length: function (n) { return n.length * 2; },
  maxAge: 1000 * 60 * 60 * 24
});

var cdn = 'https://global.api.pvp.net/api/lol';
var configLiveServer = JSON.parse(fs.readFileSync('.live-server.json', 'utf8'));
var configLolServer = JSON.parse(fs.readFileSync('.lol-server.json', 'utf8'));
var apiKey = fs.readFileSync('api.key', 'utf8');

var options = {
  hostname: 'global.api.pvp.net',
  method: 'GET',
  headers: {
    'User-Agent': 'Legend-Builder',
    'Accept-Language': 'en-US',
    'Accept-Charset': 'ISO-8859-1,utf-8',
    'Origin': 'http://' + configLolServer.host + ':' + configLolServer.port
  }
};

var headers = {
  'Access-Control-Allow-Origin': 'http://' + (configLiveServer.host || "127.0.0.1") + ':' + (configLiveServer.port || "8080"),
  'content-type': 'application/json'
};

// get all champions
var champions = '';
{
  console.start(50);
  var path = cdn + '/static-data/euw/v1.2/champion';
  options.path = url.format({ pathname: path, query: {api_key: apiKey} });
  
  var req = https.request(options, function(res) {
    res.on('data', function(d) {
      champions += d;
    })
    .on('end', function() {
      console.logHttp(options.method, path, res.statusCode);
      
      if (res.statusCode == 200) {
        champions = JSON.parse(champions);
      }
      else {
        process.exit(1);
      }
    });
  });
  req.end();
  
  req.on('error', function(e) {
    console.logHttp(options.method, path, e.statusCode, e);
    process.exit(1);
  });
}

function findChampionId(key) {
  for (var championKey in champions.data) {
    if (key.toLowerCase() === championKey.toLowerCase()) {
      return champions.data[championKey].id;
    }
  }
  return false;
}

var server = http.createServer(function (request, response) {
  console.start();
  
  var requestUrl = url.parse(request.url, true);
  
  var urlChampionIndex = request.url.indexOf('/champion/');
  if(urlChampionIndex > -1 && champions.data) {
    var championKey = requestUrl.pathname.substr(urlChampionIndex + 10);
    var championId = findChampionId(championKey);
    requestUrl.pathname = requestUrl.pathname.replace(championKey, championId);
    request.url = url.format({ pathname: requestUrl.pathname, query: requestUrl.query });
    
    if(!championId) {
      response.writeHead(500, headers);
      response.write('Champion key does not exist.\n');

      response.end();
      console.logHttp(options.method, request.url, 500);
      return;
    }
  }
  
  var cachedResponseData = cache.get(request.url);
  
  if(cachedResponseData) {
    response.writeHead(200, headers);
    response.write(cachedResponseData);
    response.end();
    console.logHttp("CACHED", request.url, 200, cache.length / 1000000 + 'MB/' + cache.max / 1000000 + 'MB');
    return;
  }
  
  var requestQuery = requestUrl.query;
  requestQuery.api_key = apiKey;
  
  options.path = url.format({ pathname: cdn + requestUrl.pathname, query: requestQuery });
  
  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(d) {
      data += d;
      response.write(d);
    })
    .on('end', function(d) {
      response.end();
      console.logHttp(options.method, request.url, res.statusCode);
      
      if(res.statusCode == 200) {
        cache.set(request.url, data);
      }
    });
  
    response.writeHead(res.statusCode, headers);
  });
  req.end();

  req.on('error', function(e) {
    response.writeHead(e.statusCode, headers);
    response.write(e + '\n');

    response.end();
    console.logHttp(options.method, request.url, e.statusCode, e);
  });
})
.listen(configLolServer.port, configLolServer.host);

console.log(configLolServer.host + ':' + configLolServer.port);