import {MockHostResponseFailure, MockHostResponseSuccess} from '../testing';
import {MockServer, MockServerResponse} from '../testing';

import {Summoner} from './summoner';

describe('Summoner', () => {
  let server: MockServer;
  let summoner: Summoner;

  beforeEach(() => {
    server = new MockServer();
    summoner = new Summoner(server);
    server.headers = {test: 'test'};
  });

  it('should get the summoner id', () => {
    server.responses = [
      {url: 'summoners', message: new MockHostResponseSuccess(JSON.stringify({'accountId': 123}))}
    ];
    let incomingMessage: any = {url: 'test'};
    let serverResponse: any = new MockServerResponse();

    summoner.get('euw', 'DinosHaveNoLife', incomingMessage, serverResponse);

    expect(serverResponse.getHeader('test')).toBe('test');
    expect(serverResponse.buffer).toBe('123');
    expect(server.mockCache.url).toBe(incomingMessage.url);
    expect(server.mockCache.data).toBe('123');
  });

  it('should not get the summoner id', () => {
    server.responses = [{url: 'summoners', message: new MockHostResponseFailure()}];
    let incomingMessage: any = {url: 'test'};
    let serverResponse: any = new MockServerResponse();

    summoner.get('euw', 'DinosHaveNoLife', incomingMessage, serverResponse);

    expect(serverResponse.getHeader('test')).toBe('test');
    expect(serverResponse.buffer).toBe('');
    expect(server.mockCache.url).toBe('');
    expect(server.mockCache.data).toBe('');
  });
});
