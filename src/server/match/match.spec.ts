import * as zlib from 'zlib';

import {settings} from '../../../config/settings';
import {MockHostResponseSuccess, MockServer, MockServerResponse} from '../testing';

import {Match} from './match';

process.argv = [
  'param', 'param', '--api=./secure/api.key', '--cert=./secure/cert.crt', '--key=./secure/cert.key'
];

describe('Match', () => {
  const server = new MockServer();
  let match: Match;

  const responseSummoners = {
    url: 'summoners',
    message: new MockHostResponseSuccess(JSON.stringify({'accountId': 123}))
  };

  const responseMatchLists = {
    url: 'matchlists/by-account',
    message: new MockHostResponseSuccess(JSON.stringify({
      'matches': [{'gameId': 2701428538}, {'gameId': 2698839638}, {'gameId': 2695882481}],
      'totalGames': 3
    }))
  };

  const responseMatch = {
    url: 'matches',
    message: new MockHostResponseSuccess(JSON.stringify({
      'participantIdentities': [{
        'player': {'summonerName': 'DinosHaveNoLife', 'currentAccountId': 123},
        'participantId': 1
      }],
      'gameDuration': 2250,
      'mapId': 11
    }))
  };

  const responseTimelines = {
    url: 'timelines',
    message: new MockHostResponseSuccess(JSON.stringify({
      'frameInterval': 60000,
      'frames': [
        {'timestamp': 0, 'participantFrames': {'1': {'totalGold': 500, 'xp': 0}}},
        {'timestamp': 60047, 'participantFrames': {'1': {'totalGold': 500, 'xp': 0}}},
        {'timestamp': 120058, 'participantFrames': {'1': {'totalGold': 538, 'xp': 206}}},
        {'timestamp': 180094, 'participantFrames': {'1': {'totalGold': 808, 'xp': 706}}}
      ]
    }))
  };

  const result = JSON.stringify({
    'xp': [
      0,    93,   657,  802,  904,  1007, 1109, 1211, 1314, 1416, 1519,
      1621, 1724, 1826, 1929, 2031, 2134, 2236, 2339, 2441, 2544, 2646,
      2749, 2851, 2954, 3056, 3159, 3261, 3364, 3466, 3569, 3671
    ],
    'gold': [
      500,  517,  781,  850,  894,  939,  984,  1029, 1073, 1118, 1163,
      1207, 1252, 1297, 1341, 1386, 1431, 1476, 1520, 1565, 1610, 1654,
      1699, 1744, 1789, 1833, 1878, 1923, 1967, 2012, 2057, 2102
    ]
  });



  beforeEach(() => {
    match = new Match(server);
  });

  it('should get frames', () => {
    server.responses = [responseSummoners, responseMatchLists, responseMatch, responseTimelines];
    const incomingMessage: any = {url: 'test'};
    const serverResponse: any = new MockServerResponse();

    match.get(
        'euw', 'DinosHaveNoLife', '123', settings.match.gameTime, settings.match.sampleSize,
        incomingMessage, serverResponse);

    expect(serverResponse.getHeader('Content-Encoding')).toBe('gzip');
    expect(zlib.gunzipSync(serverResponse.buffer).toString()).toBe(result);
    expect(server.mockCache.url).toBe(incomingMessage.url);
    expect(zlib.gunzipSync(server.mockCache.data).toString()).toBe(result);
  });
});
