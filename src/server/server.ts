import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as https from 'https';
import * as url from 'url';

let lru = require('lru-cache');
import * as async from 'async';

import {ColorConsole} from './console';
import {settings} from '../../config/settings';

let apiKey = '';
try {
  apiKey = require('raw!../../.api.key');
} catch (e) {
}

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
  public champions: Array<Array<string>> = [];

  public headers = {
    'Access-Control-Allow-Origin':
        'http://' + settings.httpServer.host + ':' + settings.httpServer.port,
    'content-type': 'application/json'
  };

  public config = {protocol: 'https://', hostname: '.api.pvp.net', apiKey: apiKey};

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

  constructor(private host: string, private port: number, cacheSettings?: any) {
    this.cache = lru(this.merge(cacheSettings, {
      max: 1048000,
      length: (n) => {
        return n.length * 2;
      },
      maxAge: 1000 * 60 * 60 * 2
    }));

    this.merge({Origin: 'http://' + this.host + ':' + this.port}, this.options.headers);
  }

  public run(callback: (req: IncomingMessage, resp: ServerResponse) => void): void {
    this.preRun();
    let server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
      this.handleRequest(request, response, callback);
    });
    server.listen(this.port, this.host);
    console.log(this.host + ':' + this.port);
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
    return this.config.protocol + this.getHostname(region) + '/api/lol' +
        (region ? '/' + region : '');
  }

  public getHostname(region?: string) {
    return (region ? region : 'global') + this.config.hostname;
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
    async.retry(
        opts || {times: 1, interval: 0},
        (cb: any, results: any) => {
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

  private sendHttpRequest(
      options: https.RequestOptions, callback: (response: HostResponse) => void) {
    let console = new ColorConsole();
    let req = http.request(
        options, (res: IncomingMessage) => this.handleResponse(console, options, res, callback));
    req.on(
        'error', (e) => this.handleResponseError(
                     console, options, {status: 500, message: e.message}, callback));
    req.end();
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
      let error: HttpError = {status: 500, message: e.status};
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
      for (let region of regions) {
        this.champions[region] = [];
        this.getChampions(region, this.handleChampions);
      }
    });
  }

  private getRegions(callback: (regions: Array<string>) => void) {
    let options = {
      path: 'http://status.leagueoflegends.com/shards',
      hostname: 'status.leagueoflegends.com',
      method: 'GET',
      headers: {
        'User-Agent': 'Legend-Builder',
        'Accept-Language': 'en-US',
        'Accept-Charset': 'ISO-8859-1,utf-8',
        Origin: 'http://' + this.host + ':' + this.port
      }
    };

    this.sendHttpRequest(options, (res) => {
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

  private getChampions(
      region: string,
      callback: (err, result: {region: string, champions?: Array<number>}) => void) {
    let championUrl = this.config.protocol + this.getHostname() + '/api/lol/static-data/' + region +
        '/' + settings.apiVersions['static-data'] + '/champion';

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
        callback(true, {region: region});
      }
    });
  }

  private handleChampions =
      (err, result) => {
        if (err) {
          setTimeout(this.getChampions, 10 * 1000, result.region, this.handleChampions);
          return;
        }
        this.champions[result.region] = result.champions;
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
    path += (path.indexOf('?') < 0 ? '?' : '&') + 'api_key=' + this.config.apiKey;
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
