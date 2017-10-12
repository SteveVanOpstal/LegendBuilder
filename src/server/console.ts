const chalk = require('chalk');

import {tim} from '../client/shared/tim';

export enum Source {
  client = 0,
  api = 1
}

export class ColorConsole {
  private timeStart = process.hrtime();

  logHttp(source: Source, method: string, path: string, statusCode: number, extra?: any) {
    const src = this.getSourceString(source);
    const type = method.padEnd(3);
    const time = (this.totalTime() + 'ms').padEnd(10);
    if (path.length > 78) {
      path = path.replace('https://', '..');
      path = path.replace('.api.riotgames.com', '..');
    }
    const prunedPath = this.prune(path, 78, '..').padEnd(78);
    if (extra) {
      extra = '[' + extra + ']';
    } else {
      extra = '';
    }
    if (statusCode !== 200) {
      this.error('%s:%s %s (%d) %s %s', src, type, prunedPath, statusCode, time, extra);
    } else {
      this.info('%s:%s %s (%d) %s %s', src, type, prunedPath, statusCode, time, extra);
    }
  }

  logHttpCached(source: Source, path: string, statusCode: number, cache: any) {
    let cacheLength = Math.round(cache.length / 1e6) + 'MB';
    if (cache.length < 1e6) {
      cacheLength = (Math.round(cache.length / 100) / 10) + 'kB';
    }
    const chacheMax = Math.round(cache.max / 1e6) + 'MB';
    this.logHttp(source, 'CAC', path, statusCode, cacheLength + '/' + chacheMax);
  }

  logHttpType() {}

  assert(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(chalk.blue(this.format(message, 'DBG')));
    console.assert.apply(this, optionalParams);
  }

  error(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(chalk.red(this.format(message, 'ERR')));
    console.error.apply(this, optionalParams);
  }

  info(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(chalk.green(this.format(message, 'INF')));
    console.info.apply(this, optionalParams);
  }

  log(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(this.format(message, 'LOG'));
    console.log.apply(this, optionalParams);
  }

  trace(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(chalk.magenta(this.format(message, 'TRC')));
    console.trace.apply(this, optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(chalk.yellow(this.format(message, 'WRN')));
    console.warn.apply(this, optionalParams);
  }

  private format(message: any, type: string): string {
    const test = new Date();
    const timestamp = test.getHours().toString().padStart(2, '0') + ':' +
        test.getMinutes().toString().padStart(2, '0') + ':' +
        test.getSeconds().toString().padStart(2, '0') + '.' +
        (Math.round(test.getMilliseconds() / 10)).toString().padStart(2, '0');
    return tim(
        '{{timestamp}} {{type}}:{{message}}', {timestamp: timestamp, type: type, message: message});
  }

  private totalTime() {
    const diff = process.hrtime(this.timeStart);
    const diffMs = (diff[0] * 1e9 + diff[1]) / 1e6;
    return Math.round(diffMs * 100) / 100;
  }

  private getSourceString(source: Source) {
    let src = '';
    switch (source) {
      case Source.client:
        src = 'CLI';
        break;
      case Source.api:
        src = 'LOL';
        break;
      default:
        src = 'UNK';
        break;
    }

    return src.padEnd(3);
  }

  private prune(str: string, length: number, prune: string): string {
    if (str.length <= length) {
      return str;
    }
    length = length - prune.length;
    return str.substr(0, length / 2) + prune + str.substr(str.length - length / 2);
  }
}

export let colorConsole = new ColorConsole();
