var https = require('https');
var console = require('./console.js');
var fs = require('fs');
var tim = require('tinytim').tim;

var config = {
  protocol: 'https://',
  hostname: '.api.pvp.net',
  summoner: '/api/lol/{{region}}/v1.4/summoner/',
  matchlist: '/api/lol/{{region}}/v2.2/matchlist/',
  match: '/api/lol/{{region}}/v2.2/match/',
  'static-data': '/api/lol/static-data/{{region}}/v1.2/',
  apiKey: fs.readFileSync('.api.key', 'utf8')
};

var options = {
  hostname: 'global.api.pvp.net',
  method: 'GET',
  headers: {
    'User-Agent': 'Legend-Builder',
    'Accept-Language': 'en-US',
    'Accept-Charset': 'ISO-8859-1,utf-8'
  }
};

var settings = require('./settings.js').settings;

exports.headers = {
  'Access-Control-Allow-Origin': 'http://' + (settings.httpServer.host || "localhost") + ':' + (settings.httpServer.port || 8080),
  'content-type': 'application/json'
};

exports.options = function(host, port) {
  options.headers.Origin = 'http://' + host + ':' + port;
}

var createUrl = exports.createUrl = function(region, type) {
  if (type) {
    return config.protocol + (type == 'static-data' ? 'global' : region) + config.hostname + tim(config[type], { region: region });
  } else {
    return config.protocol + 'global' + config.hostname + '/api/lol' + region;
  }
}

var jsonFormatter = exports.jsonFormatter = function(d) {
  return JSON.parse(d);
}

var sendRequest = exports.sendRequest = function(region, url, cb, formatterCb) {
  console.start();

  var safeUrl = url;
  url += url.indexOf('?') < 0 ? '?api_key=' + config.apiKey : '&api_key=' + config.apiKey;
  options.path = url;
  options.hostname = region + config.hostname;

  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(d) {
      data += d;
    })
      .on('end', function() {
        console.logHttp(options.method, safeUrl, res.statusCode);
        if (res.statusCode == 200) {
          cb(formatterCb ? formatterCb(data) : data, false, res.statusCode);
        }
        else {
          cb(false, data, res.statusCode);
        }
      });
  });

  req.on('error', function(e) {
    console.logHttp(options.method, safeUrl, e.statusCode, e);
    cb(false, e, e.statusCode);
  });

  req.end();
}


var champions = [];
{
  sendRequest('global', createUrl('euw', 'static-data') + 'champion', function(data, error) {
    if (data) {
      for (var championKey in data.data) {
        champions[data.data[championKey].id] = championKey;
      }
    } else {
      process.exit(1);
    }
  }, jsonFormatter);
}

exports.transformUrl = function(url) {
  var pathname = url.pathname.split('/');
  for (var i = 0; i < pathname.length; i++) {
    var part = pathname[i];
    var key = champions.indexOf(part);
    if (key >= 0) {
      url.pathname = url.pathname.replace(part, key);
      return url;
    }
  }
  return url;
}