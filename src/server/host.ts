import {ServerRequest, ServerResponse, IncomingMessage} from 'http';
import * as http from 'http';
import * as https from 'https';
import {RequestOptions} from 'https';
import * as url from 'url';
let Lru = require('lru-cache');
import * as fs from 'fs';
import {parallel, retry} from 'async';

import {ColorConsole} from './console';
import {settings} from '../../config/settings';
import {tim} from '../app/misc/tim';

export module Host {
  export interface Response {
    data: any;
    json?: any;
    status: number;
    success: boolean;
  }

  export let config = {
    protocol: 'https://',
    hostname: '.api.pvp.net',
    // summoner: '/{{region}}/v1.4/summoner/',
    // matchlist: '/{{region}}/v2.2/matchlist/',
    // match: '/{{region}}/v2.2/match/',
    apiKey: fs.readFileSync('.api.key', 'utf8')
  };

  export function getPathname(path: string): Array<string> {
    let pathname = url.parse(path).pathname;
    return pathname.split('/');
  }

  export function getQuery(path: string): any {
    return url.parse(path).query;
  }
}


export class Server {
  public champions: Array<Array<string>> = [];

  public headers = {
    'Access-Control-Allow-Origin': 'http://' + settings.httpServer.host + ':' + settings.httpServer.port,
    'content-type': 'application/json'
  };

  private options: RequestOptions = {
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
    this.cache = Lru(this.merge(cacheSettings, {
      max: 1048000,
      length: (n) => { return n.length * 2; },
      maxAge: 1000 * 60 * 60 * 2
    }));

    this.merge({
      Origin: 'http://' + this.host + ':' + this.port
    }, this.options.headers);
  }

  public run(callback: (req: ServerRequest, resp: ServerResponse) => void): void {
    this.preRun();
    let server = http.createServer((request: ServerRequest, response: ServerResponse) => {
      this.handleRequest(request, response, callback);
    });
    server.listen(this.port, this.host);
    console.log(this.host + ':' + this.port);
  }

  public sendRequest(url: string, region: string, callback: (response: Host.Response) => void): void {
    url = this.transformPath(url, region);

    let options: RequestOptions = { path: url };
    this.merge(this.options, options);

    this.sendHttpsRequest(options, callback);
  }

  public setCache(url: string, data: any): void {
    this.cache.set(url, data);
  }

  private getCache(url: string): any {
    return this.cache.get(url);
  }

  private sendHttpsRequest(options: RequestOptions, callback: (response: Host.Response) => void) {
    let console = new ColorConsole();
    let req = https.request(options, (res: IncomingMessage) => this.handleResponse(console, options, res, callback));
    req.on('error', (e) => this.handleResponseError(console, options, e, callback));
    req.end();
  }

  private sendHttpRequest(options: any, callback: (response: Host.Response) => void) {
    let console = new ColorConsole();
    let req = http.request(options, (res: IncomingMessage) => this.handleResponse(console, options, res, callback));
    req.on('error', (e) => this.handleResponseError(console, options, e, callback));
    req.end();
  }

  private handleResponse(console: ColorConsole, options: RequestOptions, res: IncomingMessage, callback: (response: Host.Response) => void) {
    let data = '';
    res.on('data', (d: string) => {
      data += d;
    });
    res.on('end', () => {
      this.handleResponseSuccess(console, options, res, data, callback);
    });
  }

  private handleResponseSuccess(console: ColorConsole, options: RequestOptions, res: IncomingMessage, data: any, callback: (response: Host.Response) => void) {
    let json = {};
    try {
      json = JSON.parse(data);
    } catch (e) {
      this.handleResponseError(console, options, e, callback);
      return;
    }

    let response: Host.Response = {
      data: data,
      json: json,
      status: res.statusCode,
      success: res.statusCode === 200
    };
    console.logHttp(options.method, this.maskApiKey(options.path), res.statusCode);
    callback(response);
  }

  private handleResponseError(console: ColorConsole, options: any, e: any, callback: (response: Host.Response) => void) {
    let response: Host.Response = {
      data: e,
      status: e.statusCode,
      success: false
    };
    console.logHttp(options.method, this.maskApiKey(options.path), e.statusCode, e);
    callback(response);
  }

  private handleRequest(request: ServerRequest, response: ServerResponse, callback: (req: ServerRequest, resp: ServerResponse) => void): void {
    let console = new ColorConsole();

    let cachedResponseData = this.getCache(request.url);
    if (cachedResponseData) {
      response.writeHead(200, this.headers);
      response.write(cachedResponseData);
      response.end();
      console.logHttp('CACHED', request.url, 200, this.cache.length / 1000000 + 'MB/' + this.cache.max / 1000000 + 'MB');
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
    this.getRegions((regions) => {
      for (let index in regions) {
        let region = regions[index];
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
          var region = res.json[index];
          regions.push(region['slug']);
        }
        callback(regions);
      } else {
        console.error('Unable to get regions');
        process.exit(1);
      }
    });
  }

  private getChampions(region: string, callback: (err, result: { region: string, champions?: Array<number> }) => void) {
    let championUrl = Host.config.protocol + 'global' + Host.config.hostname + '/api/lol/static-data/' + region + '/' + settings.apiVersions['static-data'] + '/champion';

    championUrl = this.addApiKey(championUrl);

    let options: RequestOptions = { path: championUrl };
    this.merge(this.options, options);

    this.sendHttpsRequest(options, (response: Host.Response) => {
      if (response.success) {
        let champions = [];
        for (let championKey in response.json.data) {
          champions[championKey] = response.json.data[championKey].id;
        }
        callback(null, { region: region, champions: champions });
      } else {
        console.error('Unable to get champion data for ' + region);
        callback(true, { region: region });
      }
    });
  }

  private handleChampions = (err, result) => {
    if (err) {
      setTimeout(this.getChampions(result.region, this.handleChampions), 60 * 1000);
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
    let parsedPath = url.parse(path);
    let pathname = parsedPath.pathname.split('/');
    let type = pathname[6];
    if (type !== 'champion') {
      return path;
    }
    let championKey = pathname[7];
    let championId = this.champions[region][championKey];
    if (championId >= 0) {
      parsedPath.pathname = parsedPath.pathname.replace(championKey, championId);
    }
    let formattedPath = url.format(parsedPath);
    return formattedPath;
  }

  private addApiKey(path: string): string {
    path += (path.indexOf('?') < 0 ? '?' : '&') + 'api_key=' + Host.config.apiKey;
    return path;
  }

  private maskApiKey(path: string): string {
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    let apiKeyPostion = path.indexOf('api_key=');
    if (apiKeyPostion === -1) {
      return path;
    }
    return path.substr(0, apiKeyPostion + 8) + '***';
  }
}
