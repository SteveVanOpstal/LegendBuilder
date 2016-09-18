import {parallel, reflect, waterfall} from 'async';
import {IncomingMessage, ServerResponse} from 'http';

import {settings} from '../../../config/settings';
import {colorConsole} from '../console';
import {HostResponse, HttpError, Server} from '../server';

import {Summoner} from './summoner';

let config = {
  matches: {min: 2, max: 5},
  minDuration: 20 * 60,
  default: {gameTime: 80 * 60 * 1000, sampleSize: 8},
  fill: {sampleTime: 20 * 60 * 1000}
};

namespace Errors {
  export const badRequest: HttpError = {status: 400, message: 'Invalid request.'};
  export const invalidSummoner: HttpError = {status: 404, message: 'Unable to find summoner.'};
  export const matchlist: HttpError = {
    status: 404,
    message: 'Unable to find sufficient games. Play at least ' + config.matches.min +
        ' ranked games with the chosen champion.'
  };
  export const matches: HttpError = {status: 500, message: 'Unable to process match data.'};
};

interface Frame {
  time: number;
  xp: number;
  gold: number;
}

type Frames = Array<Frame>;
type Matches = Array<Frames>;

interface CallBack {
  (err: HttpError, results?: any): void;
}

export class Match {
  private summoner: Summoner;

  constructor(private server: Server) {
    this.summoner = new Summoner(server);
  }

  public get(
      region: string, summonerName: string, championKey: string, gameTime: number,
      sampleSize: number, request: IncomingMessage, response: ServerResponse) {
    this.getData(region, summonerName, championKey, gameTime, sampleSize, (res: HostResponse) => {
      response.writeHead(res.status, this.server.headers);
      response.write(res.data);
      if (res.success) {
        this.server.setCache(request.url, res.data);
      }
      response.end();
    });
  }

  private getData(
      region: string, summonerName: string, championKey: string, gameTime: number,
      sampleSize: number, callback: (response: HostResponse) => void) {
    gameTime = isNaN(gameTime) ? config.default.gameTime : gameTime;
    sampleSize = isNaN(sampleSize) ? config.default.sampleSize : sampleSize;
    let stepSize = gameTime / (sampleSize - 1);

    waterfall(
        [
          (cb) => {
            this.summoner.getData(region, summonerName, (res: HostResponse) => {
              if (res.success && res.json[summonerName.toLowerCase()]) {
                cb(undefined, res.json[summonerName.toLowerCase()].id);
              } else {
                callback(res);
              }
            });
          },
          (summonerId: number, cb) => {
            this.getMatchList(region, summonerId, championKey, (err: HttpError, results?: any) => {
              if (err) {
                cb(err);
              } else {
                cb(undefined, summonerId, results);
              }
            });
          },
          (summonerId: number, matches, cb) => {
            this.getMatches(region, summonerId, matches, cb);
          }
        ],
        (error: Error, results: any) => {
          if (!results || !results.matches) {
            callback({data: error.message, status: 500, success: false});
            return;
          }

          if (results.matches.length < config.matches.min) {
            if (error) {
              callback({data: error.message, status: 500, success: false});
            } else {
              callback({
                data: Errors.matchlist.message,
                status: Errors.matchlist.status,
                success: false
              });
            }
            return;
          }

          let matches = this.fill(results.matches, results.interval, gameTime);
          let samples = this.getSamples(matches, sampleSize, stepSize);

          if (ENV === 'development') {
            samples = this.getDebugSamples(samples, matches, sampleSize, stepSize);
          }

          results = JSON.stringify(samples);

          callback({data: results, json: samples, status: 200, success: true});
        });
  }

  private getMatchList(
      region: string, summonerId: number, championKey: string, callback: CallBack) {
    let path = this.server.getBaseUrl(region) + '/' + settings.apiVersions.matchlist +
        '/matchlist/by-summoner/' + summonerId + '?championIds=' + championKey;
    this.server.sendRequest(path, region, (res: HostResponse) => {
      if (res.success && res.json.totalGames >= config.matches.min) {
        callback(undefined, res.json.matches);
      } else if (res.success) {
        callback(Errors.matchlist);
      } else {
        callback({status: res.status, message: res.data});
      }
    }, {times: 2, interval: 2000});
  }

  private getMatches(region: string, summonerId: number, matches: any, callback: CallBack) {
    let matchRequests = [];
    let i = 0;
    for (let match of matches) {
      i++;
      matchRequests.push(reflect((cb) => {
        this.getMatch(region, summonerId, match.matchId, (err: HttpError, results: any) => {
          if (err) {
            cb(Error(err.message), results);
          } else {
            cb(undefined, results);
          }
        });
      }));
      if (i >= config.matches.max) {
        break;
      }
    }

    parallel(matchRequests, (err: Error, results: Array<any>) => {
      let data = {interval: 120000, matches: []};
      let ind = 0;
      for (let index in results) {
        if (results[index].error) {
          colorConsole.warn('Match http error.');
          continue;
        }

        let result = results[index].value;
        if (!result || !result.timeline || !result.timeline.frameInterval) {
          colorConsole.warn('Match data incorrect.');
          continue;
        }

        if (result.matchDuration < config.minDuration) {
          colorConsole.warn(
              'Match duration too short (%d/%d).', result.matchDuration, config.minDuration);
          continue;
        }

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
          colorConsole.error('Unable to find participant.');
          continue;
        }

        if (result.timeline.frames.length <= 0) {
          colorConsole.warn('Empty match.');
          continue;
        }

        data.matches[ind] = new Array();
        result.timeline.frames.forEach((frame, frameIndex) => {
          data.matches[ind][frameIndex] = {
            time: frame.timestamp,
            xp: frame.participantFrames[participantId].xp,
            gold: frame.participantFrames[participantId].totalGold
          };
        });
        ind++;
      }

      callback(undefined, data);
    });
  }

  private getMatch(region: string, summonerId: number, matchId: number, callback: CallBack) {
    let path = this.server.getBaseUrl(region) + '/' + settings.apiVersions.match + '/match/' +
        matchId + '?includeTimeline=true';
    this.server.sendRequest(path, region, (res: HostResponse) => {
      if (res.success) {
        callback(undefined, res.json);
      } else {
        callback(Errors.matches);
      }
    }, {times: 2, interval: 5000});
  }

  private fill(matches: Matches, interval: number, limit: number) {
    for (let i = 0; i < matches.length; i++) {
      let frames: Frames = matches[i];
      let avgTrendXp = this.getAverageTrend(frames, interval, (frame) => {
        return frame.xp;
      });
      let avgTrendGold = this.getAverageTrend(frames, interval, (frame) => {
        return frame.gold;
      });

      // fill up matches
      while (frames[frames.length - 1].time < limit) {
        let lastFrame = frames[frames.length - 1];
        frames.push({
          time: lastFrame.time + interval,
          xp: lastFrame.xp + avgTrendXp,
          gold: lastFrame.gold + avgTrendGold
        });
      }
    }
    return matches;
  }

  private getAverageTrend(frames: Frames, interval: number, callback: (frame: any) => number) {
    let sampleSize = config.fill.sampleTime / interval;
    let delta = 0;
    for (let j = frames.length - 1; j >= frames.length - sampleSize; j--) {
      if (frames[j] && frames[j - 1]) {
        delta += callback(frames[j]) - callback(frames[j - 1]);
      }
    }
    return delta / sampleSize;
  }

  private getSamples(matches: Matches, sampleSize: number, stepSize: number): any {
    let samples = {xp: [], gold: []};
    for (let i = 0; i < sampleSize; i++) {
      let absTime = i * stepSize;
      let absXp = 0;
      let absG = 0;

      for (let frames of matches) {
        absXp += this.getRelativeOf(frames, absTime, (frame) => {
          return frame.xp;
        });
        absG += this.getRelativeOf(frames, absTime, (frame) => {
          return frame.gold;
        });
      }

      samples.xp.push(Math.round(absXp / matches.length));
      samples.gold.push(Math.round(absG / matches.length));
    }
    return samples;
  }

  private getDebugSamples(samples: any, matches: Matches, sampleSize: number, stepSize: number) {
    for (let index in matches) {
      let frames: Frames = matches[index];
      samples['xp' + index] = new Array();
      samples['gold' + index] = new Array();
      for (let i = 0; i < sampleSize; i++) {
        let absTime = i * stepSize;
        samples['xp' + index].push(this.getRelativeOf(frames, absTime, (frame) => {
          return frame.xp;
        }));
        samples['gold' + index].push(this.getRelativeOf(frames, absTime, (frame) => {
          return frame.gold;
        }));
      }
    }
    return samples;
  }

  private getRelativeOf(frames: Frames, time: number, callback: (frame: any) => number): number {
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
    let rel = (upperValue - lowerValue) * ratio;

    return lowerValue + rel;
  }

  private getFrameIndex(frames: Frames, time: number) {
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
