// let url = this.config.protocol + (type === 'static-data' ? 'global' : region) + this.config.hostname + tim(this.config[type], { region: region });
import {IncomingMessage, ServerResponse} from 'http';

import {Server, getPathname, getQuery} from './server';

import {settings} from '../../config/settings';

import {Summoner} from './summoner';
import {Match} from './match';

let server = new Server(
  settings.matchServer.host || 'localhost',
  settings.matchServer.port || 8081);

let summoner = new Summoner(server);
let match = new Match(server);

server.run((request: IncomingMessage, response: ServerResponse) => {
  let pathname = getPathname(request.url);
  let query = getQuery(request.url);
  var region = pathname[1];
  var type = pathname[2];

  switch (type) {
    case 'summoner':
      summoner.get(region, pathname[3], request, response);
      break;
    case 'match':
      match.get(region, pathname[3], pathname[4], query.gameTime, query.samples, request, response);
      break;
    default:
      response.write('Invalid request');
      response.end();
      break;
  }
});
