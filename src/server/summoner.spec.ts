import {MockServer, ResponseSuccess, MockIncomingMessage, MockServerResponse} from './testing';

import {Summoner} from './summoner';

describe('summoner', () => {
  let server: MockServer;
  let summoner: Summoner;

  beforeEach(() => {
    server = new MockServer();
    summoner = new Summoner(server);
  });

  it('should get the summoner id', () => {
    server.response = new ResponseSuccess('{ "xXxSwagLord69xXx": { "id": 123456 } }');
    let incomingMessage: MockIncomingMessage = {
      url: 'test1'
    };
    let serverResponse: MockServerResponse = new MockServerResponse();

    summoner.get('euw', 'xXxSwagLord69xXx', incomingMessage, serverResponse);

    expect(serverResponse.getHeader('test')).toBe('test');
    expect(serverResponse.buffer).toBe(123456);
    expect(server.mockCache.url).toBe(incomingMessage.url);
    expect(server.mockCache.data).toBe(server.response.data);
    expect(server.response.success).toBeTruthy();
    expect(server.response.data).toBe(server.response.data);
  });
});
