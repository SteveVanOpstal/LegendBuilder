import {IncomingMessage, ServerResponse} from 'http';
import {waterfall, parallel} from 'async';

import {Server, HostResponse} from './server';
import {Summoner} from './summoner';
import {settings} from '../../config/settings';

let config = {
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

namespace Errors {
  let badRequest: HttpError = {
    code: 400,
    error: 'Invalid request.'
  };
  let invalidSummoner: HttpError = {
    code: 404,
    error: 'Unable to find summoner.'
  };
  let matchlist: HttpError = {
    code: 404,
    error: 'Unable to find sufficient games. Play at least ' + config.games.min + ' ranked games with the chosen champion.'
  };
  let matches: HttpError = {
    code: 500,
    error: 'Unable to process match data.'
  };
  let participant: HttpError = {
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
    let stepSize = gameTime / (sampleSize - 1);

    waterfall(
      [
        (cb) => {
          this.summoner.getData(region, summonerName, (res) => {
            if (res.success) {
              cb(res.json[summonerName].id);
            } else {
              cb(undefined, res.data);
            }
          });
        },
        (summonerId, cb) => {
          this.getMatchList(region, summonerId, championKey, cb);
        },
        (summonerId, matches, cb) => {
          this.getMatches(region, summonerId, matches, cb);
        }
      ],
      (error, results) => {
        if (error) {
          let response: HostResponse;
          response.data = error.message;
          // response.status = error.status;
          response.success = false;
          callback(response);
          return;
        }

        let matches = this.fill(results.matches, results.interval, gameTime);

        let samples = this.getSamples(matches, sampleSize, stepSize);
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
    let path = this.server.getBaseUrl(region) + '/' + settings.apiVersions.matchlist + 'matchlist/by-summoner/' + summonerId;
    this.server.sendRequest(path, region, (res: HostResponse) => {
      if (res.success && res.json.totalGames >= config.games.min) {
        return callback(undefined, res.json);
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
      matchRequests.push((cb) => {
        let match = matches[index];
        this.getMatch(region, summonerId, match.matchId, cb);
      });
    }

    parallel(matchRequests, (err, results: Array<any>) => {
      let data = { interval: 120000, matches: [] };
      for (let index in results) {
        let result = results[index];
        if (data.interval > result.timeline.frameInterval) {
          data.interval = result.timeline.frameInterval;
        }

        let participantId = -1;
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
    let path = this.server.getBaseUrl(region) + '/' + settings.apiVersions.match + 'match' + matchId + '?includeTimeline=true';
    this.server.sendRequest(path, region, (res: HostResponse) => {
      if (res.success) {
        callback(undefined, res.json);
      } else {
        callback(Errors.matches);
      }
    });
  }

  private fill(games, interval, limit) {
    for (let i = 0; i < games.length; i++) {
      let frames = games[i];
      let deltaXp = 0;
      let deltaG = 0;
      let sampleSize = config.fill.sampleTime / interval;

      // gather samples
      for (let j = frames.length - 1; j >= frames.length - sampleSize; j--) {
        let frame = frames[j];
        let prevFrame = frames[j - 1];
        deltaXp += frame.xp - prevFrame.xp;
        deltaG += frame.g - prevFrame.g;
      }
      let avgDeltaXp = deltaXp / sampleSize;
      let avgDeltaG = deltaG / sampleSize;

      // fill up games using the average trend of the samples
      while (games[i][games[i].length - 1].time < limit) {
        let lastFrame = games[i][games[i].length - 1];
        games[i][games[i].length] = { time: lastFrame.time + interval, xp: lastFrame.xp + avgDeltaXp, g: lastFrame.g + avgDeltaG };
      }
    }
    return games;
  }

  private getSamples(matches: Array<Array<any>>, sampleSize: number, factor: number): Array<Sample> {
    let samples = Array<Sample>();
    for (let i = 0; i < sampleSize; i++) {
      let absFactor = i * factor;
      let absXp = 0;
      let absG = 0;

      for (let frames of matches) {
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

    let index = this.getFrameIndex(frames, time);
    if (index < 0) {
      return 0;
    }

    let lowerFrame = frames[index - 1];
    let upperFrame = frames[index];

    let ratio = (time - lowerFrame.time) / (upperFrame.time - lowerFrame.time);

    let lowerValue = (callback(lowerFrame));
    let upperValue = (callback(upperFrame));
    let rel = upperValue - lowerValue * ratio;

    return lowerValue + rel;
  }

  private getFrameIndex(frames: Array<any>, time: number) {
    let index = -1;
    for (let j = 0; j < frames.length; j++) {
      if (frames[j].time > time) {
        index = j;
        break;
      }
    }
    return index;
  }
}