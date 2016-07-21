import {IncomingMessage, ServerResponse} from 'http';

import {MockHostResponseFailure, MockHostResponseSuccess, MockServer, MockServerResponse} from '../testing';

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
    let data = JSON.stringify({dinoshavenolife: {id: 42457671}});
    server.responses = [{url: 'summoner', message: new MockHostResponseSuccess(data)}];
    let incomingMessage: any = {url: 'test'};
    let serverResponse: any = new MockServerResponse();

    summoner.get('euw', 'DinosHaveNoLife', incomingMessage, serverResponse);

    expect(serverResponse.getHeader('test')).toBe('test');
    expect(serverResponse.buffer).toBe('42457671');
    expect(server.mockCache.url).toBe(incomingMessage.url);
    expect(server.mockCache.data).toBe('42457671');
  });

  it('should not get the summoner id', () => {
    server.responses = [{url: 'summoner', message: new MockHostResponseFailure()}];
    let incomingMessage: any = {url: 'test'};
    let serverResponse: any = new MockServerResponse();

    summoner.get('euw', 'DinosHaveNoLife', incomingMessage, serverResponse);

    expect(serverResponse.getHeader('test')).toBe('test');
    expect(serverResponse.buffer).toBe('');
    expect(server.mockCache.url).toBe('');
    expect(server.mockCache.data).toBe('');
  });
});
