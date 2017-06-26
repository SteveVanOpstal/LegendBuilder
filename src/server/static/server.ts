import {IncomingMessage, ServerResponse} from 'http';
import * as url from 'url';

import {settings} from '../../../config/settings';
import {HostResponse, Server} from '../server';

let server = new Server(settings.static.port);

server.run((request: IncomingMessage, response: ServerResponse) => {
  let path = url.parse(request.url);
  let pathname = path.pathname.split('/');
  let region = pathname[1];
  let type = pathname[2];
  let baseUrl = server.getBaseUrl(region);
  let version = settings.api.versions[type];
  let query = path.query ? path.query : '';

  pathname.splice(0, 3);

  let fullUrl = baseUrl + type + '/' + version + '/' + pathname.join('/') + '?' + query;
  server.sendRequest(fullUrl, region, (res: HostResponse) => {
    response.writeHead(res.status, server.headers);
    response.write(res.data);
    if (res.success) {
      server.setCache(request.url, res.data);
    }
    response.end();
  });
});
