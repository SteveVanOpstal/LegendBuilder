var http = require('http');
var url = require('url');
var fs = require('fs');
var async = require('async');
var console = require('./console.js');
var host = require('./host.js');

var Lru = require("lru-cache");
var cache = Lru({
  max: 1048000,
  length: function(n) { return n.length * 2; },
  maxAge: 1000 * 60 * 60 * 2
});


var config = {
  server: require('../../settings.js').settings.matchServer,
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
  badRequest: {
    code: 400,
    text: "Invalid request."
  },
  invalidSummoner: {
    code: 404,
    text: "Unable to find summoner."
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

function getSummonerId(region, name, callback) {
  var path = url.format({ pathname: host.createUrl(region, 'summoner') + 'by-name/' + name });
  host.sendRequest(region, path, function(data, error, statusCode) {
    if (data[name]) {
      return callback(null, data[name].id);
    }
    else if (error) {
      return callback({ code: statusCode, text: error });
    }
    else {
      return callback(errors.summoner);
    }
  }, host.jsonFormatter);
}

function getMatchList(region, summonerId, championId, callback) {
  var path = url.format({ pathname: host.createUrl(region, 'matchlist') + 'by-summoner/' + summonerId, query: { championIds: championId } });
  host.sendRequest(region, path, function(data, error, statusCode) {
    if (data.totalGames >= config.games.min) {
      return callback(null, data.matches);
    }
    else if (error) {
      return callback({ code: statusCode, text: error });
    }
    else {
      return callback(errors.matchlist);
    }
  }, host.jsonFormatter);
}

function getMatches(region, summonerId, matches, callback) {
  var count = 0;
  var result = { interval: 120000, matches: [] };

  async.whilst(
    function() { return count < config.games.max && matches[count]; },
    function(cb) {
      var matchId = matches[count].matchId;

      var path = url.format({ pathname: host.createUrl(region, 'match') + matchId, query: { includeTimeline: true } });
      host.sendRequest(region, path, function(data, error, statusCode) {
        if (data && data.timeline && data.timeline.frames) {

          if (result.interval > data.timeline.frameInterval) {
            result.interval = data.timeline.frameInterval;
          }

          var participantId = -1;
          data.participantIdentities.forEach(function(participant) {
            if (participant.player.summonerId === summonerId) {
              participantId = participant.participantId;
            }
          });

          if (participantId <= -1) {
            return cb("Unable to resolve participant");
          }

          result.matches[count - 1] = new Array();
          data.timeline.frames.forEach(function(frame, frameIndex) {
            result.matches[count - 1][frameIndex] = {
              time: frame.timestamp,
              xp: frame.participantFrames[participantId].xp,
              g: frame.participantFrames[participantId].totalGold
            };
          });

          return cb();
        }
        else if (error) {
          return cb({ code: statusCode, text: error });
        }
        else {
          return cb(errors.matches);
        }
      }, host.jsonFormatter);

      count++;
    },
    function(err) {
      return err ? callback(err) : callback(null, result);
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
      var prevFrame = frames[j - 1];
      deltaXp += frame.xp - prevFrame.xp;
      deltaG += frame.g - prevFrame.g;
    }
    var avgDeltaXp = deltaXp / sampleSize;
    var avgDeltaG = deltaG / sampleSize;

    // fill up games using the average trend of the samples
    while (games[i][games[i].length - 1].time < limit) {
      var lastFrame = games[i][games[i].length - 1];
      games[i][games[i].length] = { time: lastFrame.time + interval, xp: lastFrame.xp + avgDeltaXp, g: lastFrame.g + avgDeltaG };
    }
  }
  return games;
}

function getRelativeOf(frames, time, frameCb) {
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

function getSamples(games, sampleSize, factor) {
  var result = { xp: [], g: [] };
  for (var i = 0; i < sampleSize; i++) {
    var absFactor = i * factor;
    var absXp = 0;
    var absG = 0;

    for (var j = 0; j < games.length; j++) {
      var frames = games[j];
      absXp += getRelativeOf(frames, absFactor, function(frame) { return frame.xp; });
      absG += getRelativeOf(frames, absFactor, function(frame) { return frame.g; });
    }

    result.xp[i] =  Math.round(absXp / games.length);
    result.g[i] =  Math.round(absG / games.length);
  }

  return result;
}


function handleSummoner(region, pathname, query, callbackSuccess, callbackError) {
  var name = pathname[1].toLowerCase();
  processSummoner(region, name, callbackSuccess, callbackError);
}

function processSummoner(region, name, callbackSuccess, callbackError) {
  getSummonerId(region, name, function(error, result) {
    if (error) {
      callbackError(error);
      return;
    }
    callbackSuccess(result);
  });
}

function handleMatch(region, pathname, query, callbackSuccess, callbackError) {
  var summonerId = pathname[0];
  var championId = pathname[1];
  var sampleSize = isNaN(query.samples) ? config.default.sampleSize : query.samples;
  var gameTime = isNaN(query.gameTime) ? config.default.gameTime : query.gameTime;

  if (isNaN(summonerId) || isNaN(championId)) {
    callbackError(errors.badRequest);
  }

  processMatch(region, summonerId, championId, gameTime, sampleSize, callbackSuccess, callbackError);
}

function processMatch(region, summonerId, championId, gameTime, sampleSize, callbackSuccess, callbackError) {
  var stepSize = gameTime / (sampleSize - 1);

  async.waterfall(
    [
      function(callback) {
        getMatchList(region, summonerId, championId, callback);
      },
      function(matches, callback) {
        getMatches(region, summonerId, matches, callback);
      }
    ],
    function(error, result) {
      if (error) {
        callbackError(error);
        return;
      }

      var matches = fill(result.matches, result.interval, gameTime);

      var samples = getSamples(matches, sampleSize, stepSize);
      result = JSON.stringify(samples);

      callbackSuccess(result);
    }
  );
}

function handleError(response, error) {
  response.writeHead(error.code, host.headers);
  response.write(error.text);
  response.end();

  if (error.code >= 500) {
    console.error('Response: ' + error.code);
  }
  else {
    console.warn('Response: ' + error.code);
  }
}

function handleSuccess(response, cache, result) {
  response.writeHead(200, host.headers);
  response.write(result);
  response.end();
  console.log('Response: 200');
}

var server = http.createServer(function(request, response) {
  console.start();

  console.log('Request: ' + request.url);

  var cachedResponseData = cache.get(request.url);

  if (cachedResponseData) {
    response.writeHead(200, host.headers);
    response.write(cachedResponseData);
    response.end();
    console.logHttp("CACHED", request.url, 200, cache.length / 1000000 + 'MB/' + cache.max / 1000000 + 'MB');
    return;
  }

  var defaultSuccess = function(result) {
    console.log(result);
    handleSuccess(response, cache, result);
    cache.set(request.url, result);
  };
  var defaultError = function(error) {
    handleError(response, error);
  };

  var requestUrl = url.parse(request.url, true);
  host.transformUrl(requestUrl);

  var pathname = requestUrl.pathname.split('/');
  var region = pathname[1];
  var type = pathname[2];

  pathname = pathname.splice(2);
  var query = requestUrl.query;

  switch (type) {
    case 'summoner':
      handleSummoner(region, pathname, query, defaultSuccess, defaultError);
      break;
    case 'summoner-match':
      handleSummoner(region, pathname, query,
        function(result) {
          handleMatch(region, [result, pathname[2]], query, defaultSuccess, defaultError);
        },
        defaultError);
      break;
    case 'match':
      handleMatch(region, pathname, query, defaultSuccess, defaultError);
      break;
    default:
      handleError(response, errors.badRequest);
      break;
  }
})
  .listen(config.server.port, config.server.host);

console.log(config.server.host + ':' + config.server.port);