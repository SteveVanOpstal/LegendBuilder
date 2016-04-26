import {ServerRequest, ServerResponse} from 'http';
var http = require('http');
var url = require('url');
var fs = require('fs');
var Lru = require('lru-cache');
import {waterfall} from 'async';

import {Server, Host} from './host';

let settings = require('./settings').settings;

let server = new Server(
  settings.server.staticServer.port || 8081,
  settings.server.staticServer.host || 'localhost');

let baseUrl = Host.config.protocol + 'global' + Host.config.hostname + '/api/lol';

server.run((request: ServerRequest, response: ServerResponse) => {
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
