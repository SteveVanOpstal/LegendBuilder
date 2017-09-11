import {IncomingMessage, ServerResponse} from 'http';

import {settings} from '../../../config/settings';
import {Helpers} from '../helpers';
import {HostResponse, Server} from '../server';

export class Summoner {
  constructor(private server: Server) {}

  public get(region: string, name: string, request: IncomingMessage, response: ServerResponse) {
    this.getData(region, name, (res) => {
      response.writeHead(res.status, Server.headers);
      if (res.success) {
        if (res.json && res.json.accountId) {
          const accountId = res.json.accountId.toString();
          const gzip = Helpers.jsonGzip(accountId);
          response.write(gzip);
          this.server.setCache(request.url, gzip);
        } else {
          response.write(Helpers.jsonGzip(res.data.toString()));
        }
      } else {
        response.write(Helpers.jsonGzip(res.data.toString()));
      }
      response.end();
    });
  }

  public getData(region: string, name: string, callback: (response: HostResponse) => void) {
    const path = Server.getBaseUrl(region) + 'summoner/' + settings.api.versions.summoner +
        '/summoners/by-name/' + name;
    this.server.sendRequest(path, region, callback);
  }
}
