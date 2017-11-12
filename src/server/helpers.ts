import * as fs from 'fs';
import * as zlib from 'zlib';

import {ColorConsole} from './console';

export class Helpers {
  static readFile(filename: string): string {
    try {
      return fs.readFileSync(filename).toString().replace(/^\s+|\s+$/g, '');
    } catch (e) {
      const console = new ColorConsole();
      console.error('`' + filename + '` missing or inaccesible');
      console.error(e);
      return undefined;
    }
  }

  static watchFile(filename: string, listener: FunctionStringCallback): void {
    console.log('watching: ' + filename);
    try {
      fs.watch(filename, () => {
        console.log('file change detected: ' + filename);
        const result = this.readFile(filename);
        if (result) {
          listener(result);
        }
      });
    } catch (e) {
      const console = new ColorConsole();
      console.error('`' + filename + '` missing or inaccesible, unable to watch');
    }
  }

  static jsonParse(data: string): any {
    let json = data;
    try {
      json = JSON.parse(data);
    } catch (e) {
      console.log('json parse failed: ' + e);
    }
    return json;
  }

  static jsonStringify(json: any): string {
    let data = json;
    try {
      data = JSON.stringify(json);
    } catch (e) {
      console.log('json stringify failed: ' + e);
    }
    return data;
  }

  static gzip(data: any): Buffer {
    return zlib.gzipSync(data);
  }

  static jsonGzip(data: any): Buffer {
    return this.gzip(this.jsonStringify(data));
  }
}
