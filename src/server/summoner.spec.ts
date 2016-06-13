import {MockServer, MockHostResponseSuccess, MockIncomingMessage, MockServerResponse} from './testing';

import {Summoner} from './summoner';

describe('Summoner', () => {
  let server: MockServer;
  let summoner: Summoner;
  let data = JSON.stringify({
    DinosHaveNoLife: { id: 42457671 }
  });

  beforeEach(() => {
    server = new MockServer();
    summoner = new Summoner(server);
  });

  it('should get the summoner id', () => {
    server.responses = [
      { url: 'summoner', message: new MockHostResponseSuccess(data) }
    ];
    let incomingMessage: MockIncomingMessage = {
      url: 'test1'
    };
    let serverResponse: MockServerResponse = new MockServerResponse();

    summoner.get('euw', 'DinosHaveNoLife', incomingMessage, serverResponse);

    expect(serverResponse.getHeader('test')).toBe('test');
    expect(serverResponse.buffer).toBe(data);
    expect(server.mockCache.url).toBe(incomingMessage.url);
    expect(server.mockCache.data).toBe(data);
    expect(server.responses[0].message.success).toBeTruthy();
  });
});
