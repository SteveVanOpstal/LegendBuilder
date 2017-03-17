import {settings} from '../../../config/settings';
import {MockHostResponseSuccess, MockServer, MockServerResponse} from '../testing';

import {Match} from './match';

describe('Match', () => {
  let server: MockServer;
  let match: Match;

  let responseSummoner = {
    url: 'summoner',
    message: new MockHostResponseSuccess(JSON.stringify({'DinosHaveNoLife': {'id': 42457671}}))
  };

  let responseMatchList = {
    url: 'matchlist',
    message: new MockHostResponseSuccess(JSON.stringify(
        {'matches': [{'matchId': 2701428538}, {'matchId': 2698839638}, {'matchId': 2695882481}]}))
  };

  let responseMatch = {
    url: 'match',
    message: new MockHostResponseSuccess(JSON.stringify({
      'timeline': {
        'frameInterval': 60000,
        'frames': [
          {'timestamp': 0, 'participantFrames': {'1': {'totalGold': 500, 'xp': 0}}},
          {'timestamp': 60047, 'participantFrames': {'1': {'totalGold': 500, 'xp': 0}}},
          {'timestamp': 120058, 'participantFrames': {'1': {'totalGold': 538, 'xp': 206}}},
          {'timestamp': 180094, 'participantFrames': {'1': {'totalGold': 808, 'xp': 706}}}
        ]
      },
      'participantIdentities': [{
        'player': {'summonerName': 'DinosHaveNoLife', 'summonerId': 42457671},
        'participantId': 1
      }],
      'mapId': 11
    }))
  };

  beforeEach(() => {
    server = new MockServer();
    match = new Match(server);
    server.headers = {test: 'test'};
  });

  it('should get the summoner id', () => {
    server.responses = [responseSummoner, responseMatchList, responseMatch];
    let incomingMessage: any = {url: 'test'};
    let serverResponse: any = new MockServerResponse();

    match.get(
        'euw', 'DinosHaveNoLife', '123', settings.gameTime, settings.match.sampleSize,
        incomingMessage, serverResponse);

    expect(serverResponse.getHeader('test')).toBe('test');
    expect(serverResponse.buffer).toBe(responseSummoner.message.data);
    expect(server.mockCache.url).toBe(incomingMessage.url);
    // expect(server.mockCache.data).toBe(server.response.data);
    // expect(server.response.success).toBeTruthy();
    // expect(server.response.data).toBe(server.response.data);
  });
});
