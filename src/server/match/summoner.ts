import {ServerResponse} from 'http';
import * as lru from 'lru-cache';

import {settings} from '../../../config/settings';
import {ColorConsole, Source} from '../console';
import {Helpers} from '../helpers';
import {HostResponse, Server} from '../server';

export class Summoner {
  private cache;

  constructor(private server: Server) {
    this.cache = lru({max: 67108864, length: n => n.length * 2, maxAge: 1000 * 60 * 60 * 24 * 10});
  }

  get(region: string, name: string, response: ServerResponse) {
    this.getData(region, name, (res, accountId) => {
      response.writeHead(res.status, Server.headers);
      if (accountId) {
        response.write(Helpers.jsonGzip(accountId));
      } else {
        response.write(Helpers.jsonGzip(res.data));
      }
      response.end();
    });
  }

  getData(
      region: string, name: string, callback: (response: HostResponse, accountId: number) => void) {
    const path = Server.getBaseUrl(region) + 'summoner/' + settings.api.versions.summoner +
        '/summoners/by-name/' + name;

    const cacheResult = this.cache.get(name);
    if (cacheResult) {
      const result = {accountId: cacheResult};
      callback(
          {json: result, data: Helpers.jsonStringify(result), status: 200, success: true},
          cacheResult);
      const console = new ColorConsole();
      console.logHttpCached(Source.client, path, 200, this.cache);
      return;
    }

    this.server.sendRequest(path, region, (res) => {
      callback(res, this.parseAccountId(name, res));
    });
  }

  parseAccountId(name: string, res: HostResponse) {
    if (res.success) {
      if (res.json && res.json.accountId) {
        const accountId = res.json.accountId;
        this.cache.set(name, accountId);
        return accountId;
      }
    }
    return undefined;
  }
}
