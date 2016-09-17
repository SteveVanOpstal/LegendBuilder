import {IncomingMessage, ServerResponse} from 'http';

import {settings} from '../../../config/settings';
import {HostResponse, Server} from '../server';

export class Summoner {
  constructor(private server: Server) {}

  public get(region: string, name: string, request: IncomingMessage, response: ServerResponse) {
    this.getData(region, name, (res) => {
      response.writeHead(res.status, this.server.headers);
      if (res.success) {
        let summoner = res.json[name.toLowerCase()];
        if (summoner && summoner.id) {
          let summonerId = summoner.id.toString();
          response.write(summonerId);
          this.server.setCache(request.url, summonerId);
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
    let path = this.server.getBaseUrl(region) + '/' + settings.apiVersions.summoner +
        '/summoner/by-name/' + name;
    this.server.sendRequest(path, region, callback);
  }
}
