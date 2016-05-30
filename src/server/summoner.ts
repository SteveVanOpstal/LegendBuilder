import {IncomingMessage, ServerResponse} from 'http';

import {Server, HostResponse} from './server';
import {settings} from '../../config/settings';

export class Summoner {
  constructor(private server: Server) { }

  public get(region: string, name: string, request: IncomingMessage, response: ServerResponse) {
    this.getData(region, name, (res) => {
      response.writeHead(res.status, this.server.headers);
      if (res.success && res.json[name]) {
        response.write(res.json[name].id);
        this.server.setCache(request.url, res.data);
      } else {
        response.write(res.data + '\n');
      }
      response.end();
    });
  }

  public getData(region: string, name: string, callback: (response: HostResponse) => void) {
    let baseUrl = this.server.config.protocol + region + this.server.config.hostname + '/api/lol';
    var path = baseUrl + region + '/' + settings.apiVersions.summoner + '/summoner/by-name/' + name;
    this.server.sendRequest(path, region, callback);
  }
}
