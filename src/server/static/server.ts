import {retry} from 'async';
import {IncomingMessage, ServerResponse} from 'http';
import * as stream from 'stream';
import * as url from 'url';

import {settings} from '../../../config/settings';
import {Helpers} from '../helpers';
import {HostResponse, Server} from '../server';

const server = new Server(settings.static.port, undefined, () => {
  getShardDataByRegion();
});

const shardData = [];
let shards;
function getShardDataByRegion() {
  for (const region of settings.api.regions) {
    retry(
        {
          times: Infinity,
          interval: retryCount => {
            const interval = 500 * Math.pow(2, retryCount);
            return interval < 60000 ? interval : 60000;
          }
        },
        (callback: any) => {
          getShardData(region, callback);
        },
        (err, result) => {
          if (!err) {
            shardData.push(result);
            shards = Helpers.jsonGzip(shardData);
          }
        });
  }
}

function getShardData(region: string, callback: any) {
  const url =
      Server.getBaseUrl(region) + 'status/' + settings.api.versions['status'] + '/shard-data';

  server.sendRequest(url, region, (response: HostResponse) => {
    if (response.success) {
      callback(undefined, response.json);
    } else {
      console.error('Unable to get shard data for ' + region);
      callback(true);
    }
  });
}


server.run((request: IncomingMessage, response: ServerResponse) => {
  const path = url.parse(request.url);
  const pathname = path.pathname.split('/');
  const region = pathname[1];
  const type = pathname[2];
  const baseUrl = Server.getBaseUrl(region);
  const version = settings.api.versions[type];
  const query = path.query ? path.query : '';

  if (path.pathname === '/all/status/shard-data') {
    response.writeHead(200, Server.headers);
    response.write(shards);
    response.end();
    return;
  }

  pathname.splice(0, 3);

  const fullUrl = baseUrl + type + '/' + version + '/' + pathname.join('/') + '?' + query;
  server.sendRequest(fullUrl, region, (res: HostResponse) => {
    response.writeHead(res.status, Server.headers);
    const gzip = Helpers.gzip(res.data);
    response.write(gzip);
    if (res.success) {
      server.setCache(request.url, gzip);
    }
    response.end();
  });
});
