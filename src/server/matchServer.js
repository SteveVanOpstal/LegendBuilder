var http = require('http');
var url = require('url');
var fs = require('fs');
var async = require('async');
var console = require('./console.js');
var host = require('./host.js');
var tim = require('tinytim').tim;

var Lru = require("lru-cache");
var cache = Lru({
  max: 1048000,
  length: function (n) { return n.length * 2; },
  maxAge: 1000 * 60 * 60 * 2
});

var config = {
  httpServer: JSON.parse(fs.readFileSync('.live-server.json', 'utf8')),
  server: JSON.parse(fs.readFileSync('.match-server.json', 'utf8')),
  apiKey: fs.readFileSync('api.key', 'utf8'),
  games: {
    min: 2,
    max: 5
  },
  default: {
    sampleSize: 8,
    gameTime: 80 * 60 * 1000
  },
  fill: {
    sampleTime: 10 * 60 * 1000
  }
}

var errors = {
  summoner: {
    code: 404,
    text: "Unable to find summoner {{name}} in {{region}}."
  },
  matchlist: {
    code: 404,
    text: "Unable to find sufficient games. Play at least " + config.games.min + " ranked games with the chosen champion."
  },
  matches: {
    code: 500,
    text: "Unable to process match data."
  }
}

host.options(config.server.host, config.server.port);

var headers = {
  'Access-Control-Allow-Origin': 'http://' + (config.httpServer.host || "127.0.0.1") + ':' + (config.httpServer.port || "8080"),
  'content-type': 'application/json'
};

function getSummonerId(region, name, callback) {
  var path = url.format({ pathname: host.createUrl(region, 'summoner') + 'by-name/' + name });
  host.sendRequest(region, path, function (data, error, statusCode) {
    if (data[name]) {
      callback(null, data[name].id);
    }
    else if(error) {
      callback({ code: statusCode, text: error });
    }
    else {
      callback(errors.summoner);
    }
  }, host.jsonFormatter);
}

function getMatchList(region, championId, summonerId, callback) {
  var path = url.format({ pathname: host.createUrl(region, 'matchlist') + 'by-summoner/' + summonerId, query: { championIds: championId } });
  host.sendRequest(region, path, function (data, error, statusCode) {
    if (data.totalGames >= config.games.min) {
      callback(null, summonerId, data.matches);
    }
    else if(error) {
      callback({ code: statusCode, text: error });
    }
    else {
      callback(errors.matchlist);
    }
  }, host.jsonFormatter);
}

function getMatches(region, summonerId, matches, callback) {
  var count = 0;
  var result = { interval: 120000, matches: [] };
  
  async.whilst(
    function () { return count < config.games.max && matches[count]; },
    function (cb) {
      var matchId = matches[count].matchId;

      var path = url.format({ pathname: host.createUrl(region, 'match') + matchId, query: { includeTimeline: true } });
      host.sendRequest(region, path, function (data, error, statusCode) {
        if (data.timeline.frames) {
          
          if (result.interval > data.timeline.frameInterval){
            result.interval = data.timeline.frameInterval;
          }
          
          var participantId = -1;
          data.participantIdentities.forEach(function (participant) {
            if (participant.player.summonerId == summonerId) {
              participantId = participant.participantId;
            }
          });
          
          if (participantId <= -1) {
            cb("Unable to resolve participant");
          }
          
          result.matches[count - 1] = new Array();
          data.timeline.frames.forEach(function (frame, frameIndex) {
            result.matches[count - 1][frameIndex] = {
              time: frame.timestamp,
              xp: frame.participantFrames[participantId].xp,
              g: frame.participantFrames[participantId].totalGold
            };
          });
          
          cb();
        }
        else if(error) {
          cb({ code: statusCode, text: error });
        }
        else {
          cb(errors.matches);
        }
      }, host.jsonFormatter);
      
      count++;
    },
    function (err) {
      err ? callback(err): callback(null, result);
    }
  );
}

function fill(games, interval, limit) {
  for (var i = 0; i < games.length; i++) {
    var frames = games[i];
    var deltaXp = 0;
    var deltaG = 0;
    var sampleSize = config.fill.sampleTime / interval;
    
    // gather samples
    for (var j = frames.length - 1; j >= frames.length - sampleSize; j--) {
      var frame = frames[j];
      var prevFrame = frames[j-1];
      deltaXp += frame.xp - prevFrame.xp;
      deltaG += frame.g - prevFrame.g;
    }
    var avgDeltaXp = Math.round(deltaXp / sampleSize);
    var avgDeltaG = Math.round(deltaG / sampleSize);
    
    // fill up games using the average trend of the samples
    while (games[i][games[i].length - 1].time < limit)
    {
      var lastFrame = games[i][games[i].length - 1];
      games[i][games[i].length] = { time: lastFrame.time + interval, xp: lastFrame.xp + avgDeltaXp, g: lastFrame.g + avgDeltaG };
    }
  }
  return games;
}

function getRelativeOf(frames, time, frameCb)
{
  if (!frames) {
    return false;
  }
  
  var index = -1;
  for (var j = 0; j < frames.length; j++) {
    if (frames[j].time > time) {
      index = j;
      break;
    }
  }
  
  if (index > 0) {
    var lowerFrame = frames[index - 1];
    var upperFrame = frames[index];
    
    var ratio = (time - lowerFrame.time) / (upperFrame.time - lowerFrame.time);
    var rel = (frameCb(upperFrame) - frameCb(lowerFrame)) * ratio;
    
    return frameCb(lowerFrame) + rel;
  } else {
    return false;
  }
}

function getSamples(games, sampleSize, factor)
{
  var result = { xp:[], g:[] };
  for (var i = 0; i < sampleSize; i++) {
    var absFactor = i * factor;
    var absXp = 0;
    var absG = 0;
    
    for (var j = 0; j < games.length; j++) {
      var frames = games[j];
      absXp += getRelativeOf(frames, absFactor, function (frame) { return frame.xp; });
      absG += getRelativeOf(frames, absFactor, function (frame) { return frame.g; });
    }
    
    result.xp[i] = absXp / games.length;
    result.g[i] = absG / games.length;
  }
  
  return result;
}

var server = http.createServer(function (request, response) {
  console.start();
  
  console.log('Request: ' + request.url);
  
  var cachedResponseData = cache.get(request.url);
  
  if(cachedResponseData) {
    response.writeHead(200, headers);
    response.write(cachedResponseData);
    response.end();
    console.logHttp("CACHED", request.url, 200, cache.length / 1000000 + 'MB/' + cache.max / 1000000 + 'MB');
    return;
  }
  
  var requestUrl = url.parse(request.url, true);
  host.transformUrl(requestUrl);
  
  var pathname = requestUrl.pathname.split('/');
  var region = pathname[1];
  var name = pathname[2].toLowerCase();
  var championId = pathname[3];
  var sampleSize = config.default.sampleSize;
  var gameTime = config.default.gameTime;
  
  if (!isNaN(requestUrl.query.samples)) {
    sampleSize = requestUrl.query.samples;
  }
  if (!isNaN(requestUrl.query.gametime)) {
    gameTime = requestUrl.query.gametime;
  }
  
  var stepSize = gameTime / sampleSize;
  
  async.waterfall(
      [
        function (callback) {
          getSummonerId(region, name, callback);
        },
        function (summonerId, callback) {
          getMatchList(region, championId, summonerId, callback);
        },
        function (summonerId, matches, callback) {
          getMatches(region, summonerId, matches, callback);
        }
      ],
      function (error, result) {
        if (error) {
          response.writeHead(error.code, headers);
          error.text = tim(error.text, { name: name, region: region });
          response.write(error.text);
          response.end();
          
          if (error.code >= 500) {
            console.error('Response: ' + error.code);
          }
          else {
            console.warn('Response: ' + error.code);
          }
        }
        else {
          var matches = fill(result.matches, result.interval, gameTime);
          
          var samples = getSamples(matches, sampleSize, stepSize);
          result = JSON.stringify(samples);
          console.log(samples);
        
          response.writeHead(200, headers);
          response.write(result);
          response.end();
          cache.set(request.url, result);
          console.log('Response: 200');
        }
      }
    );
})
.listen(config.server.port, config.server.host);

console.log(config.server.host + ':' + config.server.port);