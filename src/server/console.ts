import * as Colors from 'colors';
var dateFormat = require('dateformat');

import {tim} from '../app/misc/tim';

export class ColorConsole {
  private timeStart = process.hrtime();

  public logHttp(method: string, path: string, statusCode: number, extra?: any) {
    method = this.pad(method, 6);
    var time = this.pad(this.totalTime() + 'ms', 13);
    if (statusCode !== 200) {
      this.error('%s %s (%d) %s [%s]', method, path, statusCode, time, extra);
    } else {
      this.info('%s %s (%d) %s [%s]', method, path, statusCode, time, extra);
    }
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(Colors.blue(this.format(message, 'DBG')));
    console.debug.apply(this, optionalParams);
  }

  public error(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(Colors.red(this.format(message, 'ERR')));
    console.error.apply(this, optionalParams);
  }

  public info(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(Colors.green(this.format(message, 'INF')));
    console.info.apply(this, optionalParams);
  }

  public log(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(this.format(message, 'LOG'));
    console.log.apply(this, optionalParams);
  }

  public trace(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(Colors.magenta(this.format(message, 'TRC')));
    console.trace.apply(this, optionalParams);
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    optionalParams.unshift(Colors.yellow(this.format(message, 'WRN')));
    console.warn.apply(this, optionalParams);
  }

  private format(message: any, type: string): string {
    let timestamp = dateFormat(new Date(), 'HH:MM:ss.L');
    return tim('{{timestamp}} {{type}}: {{message}}', { timestamp: timestamp, type: type, message: message });
  }

  private pad(input: string, length: number) {
    return (input + Array(length).join(' ')).substring(0, length);
  }

  private totalTime() {
    var diff = process.hrtime(this.timeStart);
    var diffMs = (diff[0] * 1e9 + diff[1]) / 1000000;
    return diffMs;
  }
}
