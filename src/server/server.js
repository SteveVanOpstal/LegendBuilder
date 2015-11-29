var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var console = require('console');
var chalk = require('chalk');

var Lru = require("lru-cache");
var cache = Lru({ max: 1048000,
                  length: function (n) { return n.length * 2; },
                  maxAge: 1000 * 60 * 60 * 24 });

var serverHostname = '127.0.0.1';
var serverPort = 12345;

var region  = 'euw';
var version = 'v1.2';

var baseUrl = 'https://global.api.pvp.net/api/lol/static-data/' + region + '/' + version;
var apiKeyFile = 'api.key';
var apiKey = fs.readFileSync(apiKeyFile, 'utf8');

var options = {
  hostname: 'global.api.pvp.net',
  method: 'GET',
  headers: {
    'User-Agent': 'Legend-Builder',
    'Accept-Language': 'en-US',
    'Accept-Charset': 'ISO-8859-1,utf-8',
    'Origin': 'http://' + serverHostname + ':' + serverPort
  }
};

var headers = {
  'Access-Control-Allow-Origin': 'http://127.0.0.1:5858',
  'content-type': 'application/json'
};

var timeStart;
function totalTime() {
  var diff = process.hrtime(timeStart);
  var diffMs = (diff[0] * 1e9 + diff[1]) / 1000000;
  return diffMs;
}

// get all champions
var champions = '';
{
  timeStart = process.hrtime();
  var path = baseUrl + '/champion';
  options.path = url.format({ pathname: path, query: {api_key: apiKey} });
  
  var req = https.request(options, function(res) {
    res.on('data', function(d) {
      champions += d;
    })
    .on('end', function() {
        if (res.statusCode == 200) {
          console.log('%s %s (%d) %dms', options.method, path, res.statusCode, totalTime());
          champions = JSON.parse(champions);
        }
        else {
          console.log(chalk.red('%s %s (%d) %dms'), options.method, path, res.statusCode, totalTime());
          process.exit(1);
        }
    });
  });
  req.end();
  
  req.on('error', function(e) {
    console.log(chalk.red('%s %s (%d) %dms [%s]'), options.method, path, e.statusCode, totalTime(), e);
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
  timeStart = process.hrtime();
  
  var requestUrl = url.parse(request.url, true);
  
  if(request.url.indexOf('/champion/') > -1 && champions.data) {
    var championKey = requestUrl.pathname.substr(10);
    var championId = findChampionId(championKey);
    requestUrl.pathname = '/champion/' + championId;
    request.url = url.format({ pathname: requestUrl.pathname, query: requestUrl.query });
    
    if(!championId) {
      response.writeHead(500, headers);
      response.write('Champion key does not exist.\n');

      response.end();
      console.log(chalk.red('%s %s (500) %dms'), options.method, request.url, totalTime());
      return;
    }
  }
  
  var cachedResponseData = cache.get(request.url);
  
  if(cachedResponseData) {
    response.writeHead(200, headers);
    response.write(cachedResponseData);
    response.end();
    console.log('CACHED %s (200) %dms [%jMB/%dMB]', request.url, totalTime(), cache.length / 1000000, cache.max / 1000000);
  }
  else {
    var requestQuery = requestUrl.query;
    requestQuery.api_key = apiKey;
    
    options.path = url.format({ pathname: baseUrl + requestUrl.pathname, query: requestQuery });
    
    var req = https.request(options, function(res) {
      var data = '';
      res.on('data', function(d) {
        data += d;
        response.write(d);
      })
      .on('end', function(d) {
        response.end();
        
        if(res.statusCode != 200) {
          console.log(chalk.red('%s %s (%d) %dms'), options.method, request.url, res.statusCode, totalTime());
        }
        else {
          cache.set(request.url, data);
          console.log('%s %s (%d) %dms', options.method, request.url, res.statusCode, totalTime());
        }
      });
    
      response.writeHead(res.statusCode, headers);
    });
    req.end();
  
    req.on('error', function(e) {
      response.writeHead(e.statusCode, headers);
      response.write(e + '\n');

      response.end();
      console.log(chalk.red('%s %s (%d) %dms [%s]'), options.method, request.url, e.statusCode, totalTime(), e);
    });
  }
})
.listen(serverPort, serverHostname);

console.log(serverHostname + ':' + serverPort);