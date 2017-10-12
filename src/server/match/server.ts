import {IncomingMessage, ServerResponse} from 'http';
import * as zlib from 'zlib';

import {settings} from '../../../config/settings';
import {getPathname, getQuery, Server} from '../server';

import {Match} from './match';
import {Summoner} from './summoner';

const invalid = zlib.gzipSync('Invalid request');

const server = new Server(settings.match.port, {max: 268435456, maxAge: 1000 * 60 * 60 * 12});

const summoner = new Summoner(server);
const match = new Match(server);

server.run((request: IncomingMessage, response: ServerResponse) => {
  const pathname = getPathname(request.url);
  const query = getQuery(request.url);
  const region = pathname[1];
  const type = pathname[2];

  switch (type) {
    case 'summoner':
      summoner.get(region, pathname[3], response);
      break;
    case 'match':
      match.get(region, pathname[3], pathname[4], query.gameTime, query.samples, request, response);
      break;
    default:
      response.write(invalid);
      response.end();
      break;
  }
});
