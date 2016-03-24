import {provide} from 'angular2/core';
import {BaseRequestOptions, Http, Response, ResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, beforeEachProviders} from 'angular2/testing';
import {MockBackend, MockConnection} from 'angular2/http/testing';

import {LolApiService} from '../misc/lolapi.service';
import {Config} from './config';
import {ChampionComponent} from './champion.component';

describe('ChampionComponent', () => {
  beforeEachProviders(() => [
    provide(RouteParams, { useValue: new RouteParams({ region: 'euw' }) }),
    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: function(backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),

    LolApiService,
    ChampionComponent
  ]);


  it('should call getData() on contruct', inject([RouteParams, LolApiService], (routeParams, service) => {
    let component = new ChampionComponent(routeParams, service);
    expect(component.champion).not.toBeDefined();
    setTimeout(function() {
      expect(component.champion).toBeDefined();
    }, 500);
  }));

  let config = new Config();
  config.xp = [0, 1];
  let mockResponse = new Response(new ResponseOptions({ status: 200, body: [config] }));

  it('should get summoner data', inject([MockBackend, ChampionComponent], (mockBackend, component) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    expect(component.config).toBeDefined();
    component.getSummonerMatchData('test');
    setTimeout(function() {
      expect(component.config).toBe(config);
    }, 500);
  }));
});
