import {provide} from 'angular2/core';
import {BaseRequestOptions, Http, Response, ResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, injectAsync, beforeEachProviders} from 'angular2/testing';
import {MockBackend, MockConnection} from 'angular2/http/testing';

import {LolApiService} from '../misc/lolapi.service';
import {Config} from './config';
import {ChampionComponent} from './champion.component';

import {Observable} from 'rxjs/Observable';

describe('ChampionComponent', () => {
  beforeEachProviders(() => [
    provide(RouteParams, { useValue: new RouteParams({ region: 'euw', champion: 'VelKoz' }) }),
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

  it('should be initialised', inject([ChampionComponent], (component) => {
    expect(component.championKey).toBe('VelKoz');
    expect(component.champion).not.toBeDefined();
    expect(component.loading).toBeTruthy();
    expect(component.error).toBeFalsy();
  }));

  it('should call getData() on contruct', inject([RouteParams, LolApiService], (routeParams, service) => {
    spyOn(ChampionComponent.prototype, 'getData');
    expect(ChampionComponent.prototype.getData).not.toHaveBeenCalled();
    let component = new ChampionComponent(routeParams, service);
    expect(ChampionComponent.prototype.getData).toHaveBeenCalled();
  }));

  it('should get champion', injectAsync([MockBackend, ChampionComponent, LolApiService], (mockBackend, component, service) => {
    let mockResponse = new Response(new ResponseOptions({ status: 200, body: [{}] }));
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });
 
    expect(component.champion).not.toBeDefined();
    component.getData();
    return service.getChampion('VelKoz').toPromise().then(() => {
      expect(component.champion).toBeDefined();
    });
  }));

  it('should not get champion', injectAsync([MockBackend, ChampionComponent, LolApiService], (mockBackend, component, service) => {
    let mockResponse = new Response(new ResponseOptions({ status: 200, body: [{}] }));
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockError();
      });

    expect(component.champion).not.toBeDefined();
    component.getData();
    return service.getChampion('VelKoz').toPromise().catch(() => {
      expect(component.champion).not.toBeDefined();
      expect(component.error).toBeTruthy();
    });
  }));

  let config = new Config();
  config.xp = [0, 1];
  config.g = [0, 1];
  let mockResponse = new Response(new ResponseOptions({ status: 200, body: { xp: [0, 1], g: [0, 1] } }));

  it('should get summoner data', injectAsync([MockBackend, ChampionComponent, LolApiService], (mockBackend, component, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    expect(component.config).toBeDefined();
    component.getSummonerMatchData('');
    return service.getSummonerMatchData('', '', 0, 0).toPromise().then(() => {
      expect(component.config).toHaveEqualContent(config);
    });
  }));

  it('should not get summoner data', injectAsync([MockBackend, ChampionComponent, LolApiService], (mockBackend, component, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockError();
      });

    expect(component.config).toBeDefined();
    component.getSummonerMatchData('');
    return service.getSummonerMatchData('', '', 0, 0).toPromise().catch(() => {
      expect(component.config).not.toHaveEqualContent(config);
      expect(component.error).toBeTruthy();
    });
  }));
});
