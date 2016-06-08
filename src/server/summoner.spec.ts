import {MockServer, MockHostResponseSuccess, MockIncomingMessage, MockServerResponse} from './testing';

import {Summoner} from './summoner';

describe('Summoner', () => {
  let server: MockServer;
  let summoner: Summoner;
  let data = '{ "xXxSwagLord69xXx": { "id": 123456 } }';

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

    console.log(server.responses[0].message.data);

    summoner.get('euw', 'xXxSwagLord69xXx', incomingMessage, serverResponse);

    expect(serverResponse.getHeader('test')).toBe('test');
    expect(serverResponse.buffer).toBe(123456);
    expect(server.mockCache.url).toBe(incomingMessage.url);
    expect(server.mockCache.data).toBe(data);
    expect(server.responses[0].message.success).toBeTruthy();
  });
});
