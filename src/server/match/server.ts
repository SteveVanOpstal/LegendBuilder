import {IncomingMessage, ServerResponse} from 'http';

import {settings} from '../../../config/settings';
import {getPathname, getQuery, Server} from '../server';

import {Match} from './match';
import {Summoner} from './summoner';

let server = new Server(settings.match.port, {max: 268435456, maxAge: 1000 * 60 * 60 * 12});

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
