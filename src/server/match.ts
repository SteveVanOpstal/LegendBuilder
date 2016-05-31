import {IncomingMessage, ServerResponse} from 'http';
import {waterfall, parallel} from 'async';

import {Server, HostResponse} from './server';
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
interface Sample { xp: number; g: number; }

export class Match {
  private summoner: Summoner;

  constructor(private server: Server) {
    this.summoner = new Summoner(server);
  }

  public get(region: string, summonerName: string, championKey: string, gameTime: number, sampleSize: number, request: IncomingMessage, response: ServerResponse) {
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

  private getData(region: string, summonerName: string, championKey: string, gameTime: number, sampleSize: number, callback: (response: HostResponse) => void) {
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
          let response: HostResponse;
          response.data = error.message;
          //response.status = error.status;
          response.success = false;
          callback(response);
          return;
        }

        var matches = this.fill(results.matches, results.interval, gameTime);

        var samples = this.getSamples(matches, sampleSize, stepSize);
        results = JSON.stringify(samples);

        let response: HostResponse;
        response.data = samples;
        response.json = results;
        response.status = 200;
        response.success = true;

        callback(response);
      }
    );
  }

  private getMatchList(region, summonerId, championKey, callback: CallBack) {
    let baseUrl = this.server.config.protocol + this.server.getHostname(region) + '/api/lol';
    var path = baseUrl + region + '/' + settings.apiVersions.matchlist + 'matchlist/by-summoner/' + summonerId;
    this.server.sendRequest(path, region, (res: HostResponse) => {
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
    let baseUrl = this.server.config.protocol + this.server.getHostname(region) + '/api/lol';
    var path = baseUrl + region + '/' + settings.apiVersions.match + 'match' + matchId + '?includeTimeline=true';
    this.server.sendRequest(path, region, (res: HostResponse) => {
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

  private getSamples(matches: Array<Array<any>>, sampleSize: number, factor: number): Array<Sample> {
    var samples = Array<Sample>();
    for (var i = 0; i < sampleSize; i++) {
      var absFactor = i * factor;
      var absXp = 0;
      var absG = 0;

      for (let index in matches) {
        var frames = matches[index];
        absXp += this.getRelativeOf(frames, absFactor, (frame) => { return frame.xp; });
        absG += this.getRelativeOf(frames, absFactor, (frame) => { return frame.g; });
      }

      let sample: Sample;
      sample.xp[i] = Math.round(absXp / matches.length);
      sample.g[i] = Math.round(absG / matches.length);
      samples.push(sample);
    }

    return samples;
  }

  private getRelativeOf(frames: Array<any>, time: number, callback: (frame: any) => number): number {
    if (!frames) {
      return 0;
    }

    var index = this.getFrameIndex(frames, time);
    if (index < 0) {
      return 0;
    }

    var lowerFrame = frames[index - 1];
    var upperFrame = frames[index];

    var ratio = (time - lowerFrame.time) / (upperFrame.time - lowerFrame.time);

    let lowerValue = (callback(lowerFrame));
    let upperValue = (callback(upperFrame));
    var rel = upperValue - lowerValue * ratio;

    return lowerValue + rel;
  }

  private getFrameIndex(frames: Array<any>, time: number) {
    var index = -1;
    for (var j = 0; j < frames.length; j++) {
      if (frames[j].time > time) {
        index = j;
        break;
      }
    }
    return index;
  }
}
