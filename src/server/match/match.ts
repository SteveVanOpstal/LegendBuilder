import {parallel, reflect, waterfall} from 'async';
import {IncomingMessage, ServerResponse} from 'http';

import {settings} from '../../../config/settings';
import {colorConsole} from '../console';
import {Helpers} from '../helpers';
import {HostResponse, HttpError, Server} from '../server';

import {Summoner} from './summoner';

const config = {
  matches: {min: 2, max: 5},
  gameDuration: {min: 18 * 60},
  gameTime: {default: 45 * 60 * 1000, min: 30 * 60 * 1000, max: 60 * 60 * 1000},
  sampleSize: {default: 32, min: 8, max: 64},
  sampleTimeFrame: 10 * 60 * 1000,
  frameInterval: {max: 2 * 60 * 1000}
};

const errors = {
  badRequest: {status: 400, message: 'Invalid request.'},
  invalidSummoner: {status: 404, message: 'Unable to find summoner.'},
  matchlist: {
    status: 404,
    message: 'Unable to find sufficient games. Play at least ' + config.matches.min +
        ' ranked games with the chosen champion.'
  },
  matches: {status: 400, message: 'Unable to process match data.'}
};

interface Frame {
  time: number;
  xp: number;
  gold: number;
}

type Frames = Array<Frame>;
type Matches = Array<Frames>;

type CallBack = (err: HttpError, results?: any) => void;

export class Match {
  private summoner: Summoner;

  constructor(private server: Server) {
    this.summoner = new Summoner(server);
  }

  public get(
      region: string, summonerName: string, championKey: string, gameTime: number,
      sampleSize: number, request: IncomingMessage, response: ServerResponse) {
    this.getData(region, summonerName, championKey, gameTime, sampleSize, (res: HostResponse) => {
      response.writeHead(res.status, Server.headers);
      const gzip = Helpers.gzip(res.data);
      response.write(gzip);
      if (res.success) {
        this.server.setCache(request.url, gzip);
      }
      response.end();
    });
  }

  private limit(subject: number, setting: {default: number, min: number, max: number}): number {
    subject = isNaN(subject) ? setting.default : subject;
    subject = subject < setting.min ? setting.min : subject;
    subject = subject > setting.max ? setting.max : subject;
    return subject;
  }

  private getData(
      region: string, summonerName: string, championKey: string, gameTime: number,
      sampleSize: number, callback: (response: HostResponse) => void) {
    gameTime = this.limit(gameTime, config.gameTime);
    sampleSize = this.limit(sampleSize, config.sampleSize);
    const stepSize = gameTime / (sampleSize - 1);

    waterfall(
        [
          (cb) => {
            this.summoner.getData(region, summonerName, (res: HostResponse) => {
              if (res.success) {
                cb(undefined, res.json.accountId);
              } else {
                callback(res);
              }
            });
          },
          (accountId: number, cb) => {
            this.getMatchList(region, accountId, championKey, (err: HttpError, results?: any) => {
              if (err) {
                cb(err);
              } else {
                cb(undefined, accountId, results);
              }
            });
          },
          (accountId: number, matches, cb) => {
            this.getMatches(region, accountId, matches, cb);
          }
        ],
        (error: Error, results: any) => {
          if (!results || !results.matches) {
            callback({data: error.message, status: 400, success: false});
            return;
          }

          if (results.matches.length < config.matches.min) {
            if (error) {
              callback({data: error.message, status: 400, success: false});
            } else {
              callback({
                data: errors.matchlist.message,
                status: errors.matchlist.status,
                success: false
              });
            }
            return;
          }

          const matches = this.fill(results.matches, results.interval, gameTime);
          const samples = this.getSamples(matches, sampleSize, stepSize);

          // if (ENV === 'development') {
          //   samples = this.getDebugSamples(samples, matches, sampleSize, stepSize);
          // }

          results = JSON.stringify(samples);

          callback({data: results, json: samples, status: 200, success: true});
        });
  }

  private getMatchList(region: string, accountId: number, championKey: string, callback: CallBack) {
    const path = Server.getBaseUrl(region) + 'match/' + settings.api.versions.match +
        '/matchlists/by-account/' + accountId + '?champion=' + championKey;
    this.server.sendRequest(path, region, (res: HostResponse) => {
      if (res.success && res.json.totalGames >= config.matches.min) {
        callback(undefined, res.json.matches);
      } else if (res.success) {
        callback(errors.matchlist);
      } else {
        callback({status: res.status, message: res.data});
      }
    }, {times: 2, interval: 2000});
  }

  private getMatches(region: string, accountId: number, matches: any, callback: CallBack) {
    const matchRequests = [];
    let i = 0;
    for (const match of matches) {
      i++;
      matchRequests.push(reflect((cb) => {
        this.getMatch(region, match.gameId, (err: HttpError, results: any) => {
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

    parallel(matchRequests, (_err: Error, results: Array<any>) => {
      const data = {interval: config.frameInterval.max, matches: []};
      let ind = 0;
      for (const index of Object.keys(results)) {
        if (results[index].error) {
          colorConsole.warn('Match http error.');
          continue;
        }

        const result = results[index].value;
        if (!result || !result.timelines || !result.timelines.frames ||
            !result.timelines.frameInterval) {
          colorConsole.warn('Match data incorrect.');
          continue;
        }

        if (result.match.gameDuration < config.gameDuration.min) {
          colorConsole.warn(
              'Match duration too short (%d/%d).', result.match.gameDuration,
              config.gameDuration.min);
          continue;
        }

        if (data.interval > result.timelines.frameInterval) {
          data.interval = result.timelines.frameInterval;
        }

        let participantId = -1;
        result.match.participantIdentities.forEach((participant) => {
          if (participant.player.currentAccountId === accountId) {
            participantId = participant.participantId;
          }
        });

        if (participantId <= -1) {
          colorConsole.error('Unable to find participant.');
          continue;
        }

        if (result.timelines.frames.length <= 0) {
          colorConsole.warn('Empty match.');
          continue;
        }

        data.matches[ind] = new Array();
        result.timelines.frames.forEach((frame, frameIndex) => {
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

  private getMatch(region: string, gameId: number, callback: CallBack) {
    const requests = [];
    requests.push(reflect((cb) => {
      this.server.sendRequest(
          Server.getBaseUrl(region) + 'match/' + settings.api.versions.match + '/matches/' + gameId,
          region, (res: HostResponse) => {
            if (res.success) {
              cb(undefined, {match: res.json});
            } else {
              cb(errors.matches);
            }
          }, {times: 2, interval: 5000});
    }));

    requests.push(reflect((cb) => {
      this.server.sendRequest(
          Server.getBaseUrl(region) + 'match/' + settings.api.versions.match +
              '/timelines/by-match/' + gameId,
          region, (res: HostResponse) => {
            if (res.success) {
              cb(undefined, {timelines: res.json});
            } else {
              cb(errors.matches);
            }
          }, {times: 2, interval: 5000});
    }));

    parallel(requests, (_err: Error, results: Array<any>) => {
      const output = {match: undefined, timelines: undefined};
      for (const result of results) {
        if (result.error) {
          callback(result.error);
          return;
        } else if (result.value) {
          if (result.value.match) {
            output.match = result.value.match;
          } else if (result.value.timelines) {
            output.timelines = result.value.timelines;
          } else {
            callback(errors.matches);
          }
        }
      }
      callback(undefined, output);
    });
  }

  private fill(matches: Matches, interval: number, limit: number) {
    for (let i = 0; i < matches.length; i++) {
      const frames: Frames = matches[i];
      const avgTrendXp = this.getAverageTrend(frames, interval, (frame) => {
        return frame.xp;
      });
      const avgTrendGold = this.getAverageTrend(frames, interval, (frame) => {
        return frame.gold;
      });

      // fill up matches
      while (frames[frames.length - 1].time < limit) {
        const lastFrame = frames[frames.length - 1];
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
    const sampleSize = config.sampleTimeFrame / interval;
    let delta = 0;
    for (let j = frames.length - 1; j >= frames.length - sampleSize; j--) {
      if (frames[j] && frames[j - 1]) {
        delta += callback(frames[j]) - callback(frames[j - 1]);
      }
    }
    return delta / sampleSize;
  }

  private getSamples(matches: Matches, sampleSize: number, stepSize: number): any {
    const samples = {xp: [], gold: []};
    for (let i = 0; i < sampleSize; i++) {
      const absTime = i * stepSize;
      let absXp = 0;
      let absG = 0;

      for (const frames of matches) {
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

  // private getDebugSamples(samples: any, matches: Matches, sampleSize: number, stepSize: number) {
  //   for (let index in matches) {
  //     let frames: Frames = matches[index];
  //     samples['xp' + index] = new Array();
  //     samples['gold' + index] = new Array();
  //     for (let i = 0; i < sampleSize; i++) {
  //       let absTime = i * stepSize;
  //       samples['xp' + index].push(this.getRelativeOf(frames, absTime, (frame) => {
  //         return frame.xp;
  //       }));
  //       samples['gold' + index].push(this.getRelativeOf(frames, absTime, (frame) => {
  //         return frame.gold;
  //       }));
  //     }
  //   }
  //   return samples;
  // }

  private getRelativeOf(frames: Frames, time: number, callback: (frame: any) => number): number {
    if (!frames) {
      return 0;
    }

    const index = this.getFrameIndex(frames, time);
    if (index < 0) {
      return 0;
    }

    if (index === 0) {
      return callback(frames[0]);
    }

    const lowerFrame = frames[index - 1];
    const upperFrame = frames[index];

    const ratio = (time - lowerFrame.time) / (upperFrame.time - lowerFrame.time);

    const lowerValue = (callback(lowerFrame));
    const upperValue = (callback(upperFrame));
    const rel = (upperValue - lowerValue) * ratio;

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
