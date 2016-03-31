import {provide} from 'angular2/core';
import {BaseRequestOptions, Http, Response, ResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';

import {it, inject, beforeEachProviders} from 'angular2/testing';
import {MockBackend, MockConnection} from 'angular2/http/testing';

import {LolApiService} from '../misc/lolapi.service';

describe('LolApiService', () => {
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

    LolApiService
  ]);

  var mockResponse = new Response(new ResponseOptions({ status: 200, body: [{ test: true }] }));



  it('should get realm data', inject([MockBackend, LolApiService], (mockBackend, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    service.getRealm().subscribe(res => {
      expect(res).toBeDefined();
      expect(res[0].test).toBeTruthy();
    });
  }));

  it('should get champions', inject([MockBackend, LolApiService], (mockBackend, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    service.getChampions().subscribe(res => {
      expect(res).toBeDefined();
      expect(res[0].test).toBeTruthy();
    });
  }));

  it('should get champion', inject([MockBackend, LolApiService], (mockBackend, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    service.getChampions().subscribe(res => {
      expect(res).toBeDefined();
      expect(res[0].test).toBeTruthy();
    });
  }));

  it('should get items', inject([MockBackend, LolApiService], (mockBackend, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    service.getChampion(0).subscribe(res => {
      expect(res).toBeDefined();
      expect(res[0].test).toBeTruthy();
    });
  }));

  it('should get masteries', inject([MockBackend, LolApiService], (mockBackend, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    service.getMasteries().subscribe(res => {
      expect(res).toBeDefined();
      expect(res[0].test).toBeTruthy();
    });
  }));

  it('should get summonerMatchData', inject([MockBackend, LolApiService], (mockBackend, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    service.getSummonerMatchData('', '', 0, 0)
      .subscribe(res => {
        expect(res).toBeDefined();
        expect(res[0].test).toBeTruthy();
      });
  }));

  it('should get the correct link to the static-server', inject([LolApiService], (service) => {
    expect(service.linkStaticData()).toBe('http://localhost:8081/static-data/euw/v1.2');
    service.staticServer = { host: 'test', port: 5 };
    expect(service.linkStaticData()).toBe('http://test:5/static-data/euw/v1.2');
  }));

  it('should get the correct link to the match-server', inject([LolApiService], (service) => {
    expect(service.linkMatchData()).toBe('http://localhost:8082/euw');
    service.matchServer = { host: 'test', port: 5 };
    expect(service.linkMatchData()).toBe('http://test:5/euw');
  }));
});
