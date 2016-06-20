import {IncomingMessage, ServerResponse} from 'http';

import {settings} from '../../config/settings';

import {Match} from './match';
import {Server, getPathname, getQuery} from './server';
import {Summoner} from './summoner';

let server = new Server(settings.matchServer.host || 'localhost', settings.matchServer.port || 8081);

let summoner = new Summoner(server);
let match = new Match(server);

server.run((request: IncomingMessage, response: ServerResponse) => {
  let pathname = getPathname(request.url);
  let query = getQuery(request.url);
  let region = pathname[1];
  let type = pathname[2];

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
