var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var console = require('tracer').colorConsole(
                {
                    format : "{{timestamp}} {{title}}: {{message}}",
                    dateformat : "HH:MM:ss.L",
                    preprocess :  function(data){
                        data.title = padRight(data.title, 5);
                    }
                });

var Lru = require("lru-cache");
var cache = Lru({ max: 1048000,
                  length: function (n) { return n.length * 2; },
                  maxAge: 1000 * 60 * 60 * 24 });

var serverHostname = '127.0.0.1';
var serverPort = 12345;

var baseUrl = 'https://global.api.pvp.net/api/lol';
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

function padLeft(str, length) {
  if(str.length > length - 3) {
    length -= 3;
    return '.. ' + str.slice(-length);
  }
  else {
    return (str + ' '.repeat(length)).substring(0, length);
  }
};

function padRight(str, length) {
  return (str + ' '.repeat(length)).substring(0, length);
};

function log(error, method, path, statusCode, extra) {
  method = padRight(method, 6);
  path = padLeft(path, 52);
  var time = padRight(totalTime() + 'ms', 13);
  if(error) {
    console.error('%s %s (%d) %s [%s]', method, path, statusCode, time, extra);
  }
  else {
    console.info('%s %s (%d) %s [%s]', method, path, statusCode, time, extra);
  }
}

function info(method, path, statusCode, extra) {
  log(false, method, path, statusCode, extra);
}

function error(method, path, statusCode, extra) {
  log(true, method, path, statusCode, extra);
}

// get all champions
var champions = '';
{
  timeStart = process.hrtime();
  var path = baseUrl + '/static-data/euw/v1.2/champion';
  options.path = url.format({ pathname: path, query: {api_key: apiKey} });
  
  var req = https.request(options, function(res) {
    res.on('data', function(d) {
      champions += d;
    })
    .on('end', function() {
        if (res.statusCode == 200) {
          info(options.method, path, res.statusCode);
          champions = JSON.parse(champions);
        }
        else {
          error(options.method, path, res.statusCode);
          process.exit(1);
        }
    });
  });
  req.end();
  
  req.on('error', function(e) {
    error(options.method, path, e.statusCode, e);
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
      error(options.method, request.url, 500);
      return;
    }
  }
  
  var cachedResponseData = cache.get(request.url);
  
  if(cachedResponseData) {
    response.writeHead(200, headers);
    response.write(cachedResponseData);
    response.end();
    info("CACHED", request.url, 200, cache.length / 1000000 + 'MB/' + cache.max / 1000000 + 'MB');
    return;
  }
  
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
        error(options.method, request.url, res.statusCode);
      }
      else {
        cache.set(request.url, data);
        info(options.method, request.url, res.statusCode);
      }
    });
  
    response.writeHead(res.statusCode, headers);
  });
  req.end();

  req.on('error', function(e) {
    response.writeHead(e.statusCode, headers);
    response.write(e + '\n');

    response.end();
    error(options.method, request.url, e.statusCode, e);
  });
})
.listen(serverPort, serverHostname);

console.log(serverHostname + ':' + serverPort);