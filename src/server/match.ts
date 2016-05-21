import {ServerRequest, ServerResponse} from 'http';
import {waterfall, parallel} from 'async';

import {Server, Host} from './host';
import {Summoner} from './summoner';
import {settings} from '../../config/settings';

var config = {
  games: {
    min: 2,
    max: 5
  },
  default: {
    gameTime: 80 * 60 * 1000,
    sampleSize: 8
  },
  fill: {
    sampleTime: 10 * 60 * 1000
  }
};

interface HttpError {
  code: number;
  error: string;
}

module Errors {
  export let badRequest: HttpError = {
    code: 400,
    error: 'Invalid request.'
  };
  export let invalidSummoner: HttpError = {
    code: 404,
    error: 'Unable to find summoner.'
  };
  export let matchlist: HttpError = {
    code: 404,
    error: 'Unable to find sufficient games. Play at least ' + config.games.min + ' ranked games with the chosen champion.'
  };
  export let matches: HttpError = {
    code: 500,
    error: 'Unable to process match data.'
  };
  export let participant: HttpError = {
    code: 404,
    error: 'Unable to find participant.'
  };
};

interface CallBack { (err: HttpError, results?: any): void; }

export class Match {
  private summoner: Summoner;

  constructor(private server: Server) {
    this.summoner = new Summoner(server);
  }

  public get(region: string, summonerName: string, championKey: string, gameTime: number, sampleSize: number, request: ServerRequest, response: ServerResponse) {
    this.getData(region, summonerName, championKey, gameTime, sampleSize, (res) => {
      response.writeHead(res.status, this.server.headers);
      if (res.success) {
        response.write(res.json);
        this.server.setCache(request.url, res.data);
      } else {
        response.write(res.data + '\n');
      }
      response.end();
    });
  }

  public getData(region: string, summonerName: string, championKey: string, gameTime: number, sampleSize: number, callback: (response: Host.Response) => void) {
    gameTime = isNaN(gameTime) ? config.default.gameTime : gameTime;
    sampleSize = isNaN(sampleSize) ? config.default.sampleSize : sampleSize;
    var stepSize = gameTime / (sampleSize - 1);

    waterfall(
      [
        (callback) => {
          this.summoner.getData(region, summonerName, (res) => {
            if (res.success) {
              callback(res.json[summonerName].id);
            } else {
              callback(null, res.data);
            }
          });
        },
        (summonerId, callback) => {
          this.getMatchList(region, summonerId, championKey, callback);
        },
        (summonerId, matches, callback) => {
          this.getMatches(region, summonerId, matches, callback);
        }
      ],
      (error, results) => {
        if (error) {
          let response: Host.Response;
          response.data = error.message;
          //response.status = error.status;
          response.success = false;
          callback(response);
          return;
        }

        var matches = this.fill(results.matches, results.interval, gameTime);

        var samples = this.getSamples(matches, sampleSize, stepSize);
        results = JSON.stringify(samples);

        let response: Host.Response;
        response.data = samples;
        response.json = results;
        response.status = 200;
        response.success = true;

        callback(response);
      }
    );
  }

  private getMatchList(region, summonerId, championKey, callback: CallBack) {
    let baseUrl = Host.config.protocol + region + Host.config.hostname + '/api/lol';
    var path = baseUrl + region + '/' + settings.apiVersions.matchlist + 'matchlist/by-summoner/' + summonerId;
    this.server.sendRequest(path, region, (res: Host.Response) => {
      if (res.success && res.json.totalGames >= config.games.min) {
        return callback(null, res.json);
      } else if (res.success) {
        return callback(Errors.matchlist);
      } else {
        return callback({ code: res.status, error: res.data });
      }
    });
  }

  private getMatches(region: string, summonerId: number, matches, callback: CallBack) {
    let matchRequests = [];
    for (let index in matches) {
      matchRequests.push((callback) => {
        let match = matches[index];
        this.getMatch(region, summonerId, match.matchId, callback);
      });
    }

    parallel(matchRequests, (err, results: Array<any>) => {
      var data = { interval: 120000, matches: [] };
      for (let index in results) {
        let result = results[index];
        if (data.interval > result.timeline.frameInterval) {
          data.interval = result.timeline.frameInterval;
        }

        var participantId = -1;
        result.participantIdentities.forEach((participant) => {
          if (participant.player.summonerId === summonerId) {
            participantId = participant.participantId;
          }
        });

        if (participantId <= -1) {
          callback(Errors.participant);
        }

        data.matches[index] = new Array();
        result.timeline.frames.forEach((frame, frameIndex) => {
          data.matches[index][frameIndex] = {
            time: frame.timestamp,
            xp: frame.participantFrames[participantId].xp,
            g: frame.participantFrames[participantId].totalGold
          };
        });
      }
    });
  }

  private getMatch(region: string, summonerId: number, matchId: number, callback: CallBack) {
    let baseUrl = Host.config.protocol + region + Host.config.hostname + '/api/lol';
    var path = baseUrl + region + '/' + settings.apiVersions.match + 'match' + matchId + '?includeTimeline=true';
    this.server.sendRequest(path, region, (res: Host.Response) => {
      if (res.success) {
        callback(null, res.json);
      } else {
        callback(Errors.matches);
      }
    });
  }

  private fill(games, interval, limit) {
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

  private getRelativeOf(frames, time, frameCb) {
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

  private getSamples(games, sampleSize, factor) {
    var result = { xp: [], g: [] };
    for (var i = 0; i < sampleSize; i++) {
      var absFactor = i * factor;
      var absXp = 0;
      var absG = 0;

      for (var j = 0; j < games.length; j++) {
        var frames = games[j];
        absXp += this.getRelativeOf(frames, absFactor, function (frame) { return frame.xp; });
        absG += this.getRelativeOf(frames, absFactor, function (frame) { return frame.g; });
      }

      result.xp[i] = Math.round(absXp / games.length);
      result.g[i] = Math.round(absG / games.length);
    }

    return result;
  }
}
