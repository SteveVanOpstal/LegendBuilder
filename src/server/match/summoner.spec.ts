import * as zlib from 'zlib';

import {MockHostResponseFailure, MockHostResponseSuccess} from '../testing';
import {MockServer, MockServerResponse} from '../testing';

import {Summoner} from './summoner';

process.argv = [
  'param', 'param', '--api=./secure/api.key', '--cert=./secure/cert.crt', '--key=./secure/cert.key'
];

describe('Summoner', () => {
  const server = new MockServer();
  let summoner: Summoner;

  beforeEach(() => {
    summoner = new Summoner(server);
  });

  it('should get the summoner id', () => {
    server.responses = [
      {url: 'summoners', message: new MockHostResponseSuccess(JSON.stringify({'accountId': 123}))}
    ];
    const serverResponse: any = new MockServerResponse();

    summoner.get('euw', 'DinosHaveNoLife', serverResponse);

    expect(serverResponse.getHeader('Content-Encoding')).toBe('gzip');
    expect(zlib.gunzipSync(serverResponse.buffer).toString()).toBe('123');
  });

  it('should not get the summoner id', () => {
    server.responses = [{url: 'summoners', message: new MockHostResponseFailure()}];
    const serverResponse: any = new MockServerResponse();

    summoner.get('euw', 'DinosHaveNoLife', serverResponse);

    expect(serverResponse.getHeader('Content-Encoding')).toBe('gzip');
    expect(zlib.gunzipSync(serverResponse.buffer).toString()).toBe('""');
  });
});
