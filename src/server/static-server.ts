import {IncomingMessage, ServerResponse} from 'http';
var url = require('url');
var Lru = require('lru-cache');

import {Server, Host} from './host';

import {settings} from '../../config/settings';

let server = new Server(settings.staticServer.host, settings.staticServer.port);

let baseUrl = Host.config.protocol + 'global' + Host.config.hostname + '/api/lol';

server.run((request: IncomingMessage, response: ServerResponse) => {
  let pathname = Host.getPathname(request.url);
  server.sendRequest(baseUrl + request.url, pathname[2], (res: Host.Response) => {
    response.writeHead(res.status, server.headers);
    if (res.success) {
      response.write(res.data);
      server.setCache(request.url, res.data);
    } else {
      response.write(res.data + '\n');
    }
    response.end();
  });
});
