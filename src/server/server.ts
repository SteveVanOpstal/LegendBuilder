import * as fs from 'fs';
import {IncomingMessage, ServerResponse} from 'http';
import * as https from 'https';
import * as url from 'url';

let lru = require('lru-cache');
import {retry, parallel, reflect} from 'async';
import * as minimist from 'minimist';

import {ColorConsole} from './console';
import {settings} from '../../config/settings';

function readFile(file: string) {
  try {
    return fs.readFileSync(file);
  } catch (e) {
    let console = new ColorConsole();
    console.error(file + ' missing');
    return '';
  }
}

let argv = minimist(process.argv.slice(2));

let apiKey = readFile(argv['api']).toString().replace(/^\s+|\s+$/g, '');
let ssl = {cert: readFile(argv['cert']), key: readFile(argv['key'])};


export interface HostResponse {
  data: string;
  json?: any;
  status: number;
  success: boolean;
}

export function getPathname(path: string): Array<string> {
  let pathname = url.parse(path).pathname;
  return pathname.split('/');
}

export function getQuery(path: string): any {
  return url.parse(path, true).query;
}

export interface HttpError {
  status: number;
  message: string;
}

export class Server {
  champions: Array<Array<string>> = [];

  headers = {'Access-Control-Allow-Origin': '*', 'content-type': 'application/json'};

  protocol = 'https://';
  hostname = '.api.pvp.net';

  private options: https.RequestOptions = {
    hostname: 'global.api.pvp.net',
    method: 'GET',
    headers: {
      'User-Agent': 'Legend-Builder',
      'Accept-Language': 'en-US',
      'Accept-Charset': 'ISO-8859-1,utf-8'
    }
  };

  private cache;

  constructor(private port: number, cacheSettings?: any) {
    this.cache = lru(this.merge(cacheSettings, {
      max: 1048576,
      length: (n) => {
        return n.length * 2;
      },
      maxAge: 1000 * 60 * 60 * 2
    }));

    this.merge({Origin: 'https://' + settings.domain}, this.options.headers);
  }

  public run(callback: (req: IncomingMessage, resp: ServerResponse) => void): void {
    this.preRun();
    let server = https.createServer(ssl, (request: IncomingMessage, response: ServerResponse) => {
      this.handleRequest(request, response, callback);
    });
    server.listen(this.port);
    console.log('listening on port: ' + this.port);
  }

  public sendRequest(
      url: string, region: string, callback: (response: HostResponse) => void,
      opts?: {times: number, interval: number}): void {
    url = this.transformPath(url, region);

    let options: https.RequestOptions = {path: url};
    this.merge(this.options, options);
    options.hostname = url.indexOf('global') > 0 ? this.getHostname() : this.getHostname(region);

    this.sendHttpsRequest(options, callback, opts);
  }

  public getBaseUrl(region?: string) {
    return this.protocol + this.getHostname(region) + '/api/lol' + (region ? '/' + region : '');
  }

  public getHostname(region?: string) {
    return (region ? region : 'global') + this.hostname;
  }

  public setCache(url: string, data: any): void {
    this.cache.set(url, data);
  }

  private getCache(url: string): any {
    return this.cache.get(url);
  }

  private sendHttpsRequest(
      options: https.RequestOptions, callback: (response: HostResponse) => void,
      opts?: {times: number, interval: number}) {
    let console = new ColorConsole();
    retry(
        opts || {times: 1, interval: 0},
        (cb: any) => {
          let req = https.request(options, (res: IncomingMessage) => {
            cb(undefined, res);
          });
          req.on('error', (e: Error) => {
            cb(e, undefined);
          });
          req.end();
        },
        (error: Error, results: any) => {
          if (error) {
            this.handleResponseError(
                console, options, {status: 500, message: error.message}, callback);
          } else {
            this.handleResponse(console, options, results, callback);
          }
        });
  }

  private handleResponse(
      console: ColorConsole, options: https.RequestOptions, res: IncomingMessage,
      callback: (response: HostResponse) => void) {
    let data = '';
    res.on('data', (d: string) => {
      data += d;
    });
    res.on('end', () => {
      this.handleResponseSuccess(console, options, res, data, callback);
    });
  }

  private handleResponseSuccess(
      console: ColorConsole, options: https.RequestOptions, res: IncomingMessage, data: any,
      callback: (response: HostResponse) => void) {
    let json;
    try {
      json = JSON.parse(data);
    } catch (e) {
      let error: HttpError = {status: 500, message: e.message};
      this.handleResponseError(console, options, error, callback);
      return;
    }

    if (json.status) {
      let error: HttpError = {status: json.status.status_code, message: json.status.message};
      this.handleResponseError(console, options, error, callback);
      return;
    }

    let response: HostResponse =
        {data: data, json: json, status: res.statusCode, success: res.statusCode === 200};
    console.logHttp(options.method, this.maskApiKey(options.path), res.statusCode);
    callback(response);
  }

  private handleResponseError(
      console: ColorConsole, options: https.RequestOptions, e: HttpError,
      callback: (response: HostResponse) => void) {
    let response: HostResponse = {data: e.message, status: e.status, success: false};
    console.logHttp(options.method, this.maskApiKey(options.path), e.status, e.message);
    callback(response);
  }

  private handleRequest(
      request: IncomingMessage, response: ServerResponse,
      callback: (req: IncomingMessage, resp: ServerResponse) => void): void {
    let console = new ColorConsole();

    let cachedResponseData = this.getCache(request.url);
    if (cachedResponseData) {
      response.writeHead(200, this.headers);
      response.write(cachedResponseData);
      response.end();
      console.logHttp(
          'CACHED', request.url, 200,
          this.cache.length / 1000000 + 'MB/' + this.cache.max / 1000000 + 'MB');
      return;
    }

    console.logHttp(request.method, request.url, response.statusCode);
    callback(request, response);
  }

  private merge(src: Object, target: Object): Object {
    for (let prop in src) {
      target[prop] = src[prop];
    }
    return target;
  }

  private preRun() {
    this.getRegions((regions: Array<string>) => {
      let requests = [];
      for (let region of regions) {
        this.champions[region] = [];
        requests.push(reflect((cb) => {
          retry(
              {
                times: Infinity,
                interval: (retryCount) => {
                  let interval = 500 * Math.pow(2, retryCount);
                  return interval < 60000 ? interval : 60000;
                }
              },
              (callback: any) => {
                this.getChampions(region, callback);
              },
              cb);
        }));
      }

      parallel(requests, (_error: Error, results: Array<any>) => {
        for (let result of results) {
          if (result.error) {
          } else {
            this.champions[result.value.region] = result.value.champions;
          }
        }
      });
    });
  }

  private getRegions(callback: (regions: Array<string>) => void) {
    let options = {
      path: 'https://status.leagueoflegends.com/shards',
      hostname: 'status.leagueoflegends.com',
      method: 'GET',
      headers: {
        'User-Agent': 'Legend-Builder',
        'Accept-Language': 'en-US',
        'Accept-Charset': 'ISO-8859-1,utf-8',
        Origin: 'https://' + settings.domain
      }
    };

    this.sendHttpsRequest(options, (res) => {
      if (res.success) {
        let regions = [];
        for (let index in res.json) {
          let region = res.json[index];
          regions.push(region.slug);
        }
        callback(regions);
      } else {
        console.error('Unable to get regions');
        process.exit(1);
      }
    });
  }

  private getChampions(region: string, callback: any) {
    let championUrl = this.protocol + this.getHostname() + '/api/lol/static-data/' + region + '/' +
        settings.apiVersions['static-data'] + '/champion';

    championUrl = this.addApiKey(championUrl);

    let options: https.RequestOptions = {path: championUrl};
    this.merge(this.options, options);

    this.sendHttpsRequest(options, (response: HostResponse) => {
      if (response.success) {
        let champions = [];
        for (let championKey in response.json.data) {
          champions[championKey.toLowerCase()] = response.json.data[championKey].id;
        }
        callback(undefined, {region: region, champions: champions});
      } else {
        console.error('Unable to get champion data for ' + region);
        callback(true);
      }
    });
  }

  private transformPath(path: string, region: string): string {
    path = this.replaceChampion(path, region);
    path = this.addApiKey(path);
    return path;
  }

  private replaceChampion(path: string, region: string): string {
    let championKey = this.getChampionKey(path);
    if (!championKey) {
      return path;
    }
    let championId = this.getChampionId(region, championKey);
    if (championId >= 0) {
      path = path.replace(championKey, championId);
    }
    return path;
  }

  private getChampionKey(path: string): string {
    let parsedPath = url.parse(path, true);
    let pathname = parsedPath.pathname.split('/');
    let type = pathname[6];
    if (type === 'champion') {
      return pathname[7];
    }
    if (type === 'by-summoner') {
      return parsedPath.query.championIds;
    }
    return undefined;
  }

  private getChampionId(region: string, championKey: string) {
    if (!this.champions[region]) {
      return 0;
    }
    return this.champions[region][championKey.toLowerCase()];
  }

  private addApiKey(path: string): string {
    path += (path.indexOf('?') < 0 ? '?' : '&') + 'api_key=' + apiKey;
    return path;
  }

  private maskApiKey(path: string): string {
    if (process.env.NODE_ENV === 'development') {
      return path;
    }
    let apiKeyPostion = path.indexOf('api_key=');
    if (apiKeyPostion === -1) {
      return path;
    }
    return path.substr(0, apiKeyPostion + 8) + '***';
  }
}
