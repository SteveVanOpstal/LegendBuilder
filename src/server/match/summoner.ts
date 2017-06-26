import {IncomingMessage, ServerResponse} from 'http';

import {settings} from '../../../config/settings';
import {HostResponse, Server} from '../server';

export class Summoner {
  constructor(private server: Server) {}

  public get(region: string, name: string, request: IncomingMessage, response: ServerResponse) {
    this.getData(region, name, (res) => {
      response.writeHead(res.status, this.server.headers);
      if (res.success) {
        if (res.json && res.json.accountId) {
          let accountId = res.json.accountId.toString();
          response.write(accountId);
          this.server.setCache(request.url, accountId);
        } else {
          response.write(res.data.toString());
        }
      } else {
        response.write(res.data.toString());
      }
      response.end();
    });
  }

  public getData(region: string, name: string, callback: (response: HostResponse) => void) {
    let path = this.server.getBaseUrl(region) + 'summoner/' + settings.api.versions.summoner +
        '/summoners/by-name/' + name;
    this.server.sendRequest(path, region, callback);
  }
}
