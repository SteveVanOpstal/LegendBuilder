var http = require('http');
var https = require('https');
var url = require('url');
var console = require('console');

var Lru = require("lru-cache");
var cache = Lru({ max: 1048000,
                  length: function (n) { return n.length * 2; },
                  maxAge: 1000 * 60 * 60 * 24 });

var serverHostname = '127.0.0.1';
var serverPort = 12345;

var region  = 'euw';
var version = 'v1.2';

var baseUrl = 'https://global.api.pvp.net/api/lol/static-data/' + region + '/' + version;
var apiKey  = 'b35cd480-6055-4724-b860-6c3553b1555a';

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
function totalTime()
{
  var diff = process.hrtime(timeStart);
  var diffMs = (diff[0] * 1e9 + diff[1]) / 1000000;
  return diffMs;
}

var server = http.createServer(function (request, response)
{
  timeStart = process.hrtime();
  
  var cachedResponseData = cache.get(request.url);
  
  if(cachedResponseData)
  {
    response.writeHead(200, headers);
    response.write(cachedResponseData);
    response.end();
    console.log('CACHED %s (200) %dms, %jMB/%dMB', request.url, totalTime(), cache.length / 1000000, cache.max / 1000000);
  }
  else
  {
    var requestUrl = url.parse(request.url, true);
    var requestQuery = requestUrl.query;
    requestQuery.api_key = apiKey;
    
    options.path = url.format({ pathname: baseUrl + requestUrl.pathname, query: requestQuery });
    
    var req = https.request(options, function(res)
    {
      var data = '';
      res.on('data', function(d) {
        data += d;
        response.write(d);
      })
      .on('end', function(d) {
        response.end();
        console.log('%s %s (%d) %dms', options.method, request.url, res.statusCode, totalTime());
        
        cache.set(request.url, data);
      });
    
      response.writeHead(200, headers);
    });
    req.end();
  
    req.on('error', function(e)
    {
      response.writeHead(500, headers);
      response.write(e + '\n');
      
      response.end();
      console.log('%s %s (%d) %dms, %s', options.method, request.url, e.statusCode, totalTime(), e);
    });
  }
  
})
.listen(serverPort, serverHostname);

console.log(serverHostname + ':' + serverPort);