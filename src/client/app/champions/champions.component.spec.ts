import {provide} from '@angular/core';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {Router, RouteSegment} from '@angular/router';

import {it, inject, async, beforeEachProviders} from '@angular/core/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {ROUTER_FAKE_PROVIDERS} from '@angular/router/testing';

import {LolApiService} from '../misc/lolapi.service';
import {ChampionsComponent} from './champions.component';

import {MockRouteSegment} from '../testing';

describe('ChampionsComponent', () => {
  beforeEachProviders(() => [
    provide(RouteSegment, { useValue: new MockRouteSegment({ region: 'euw' }) }),
    ROUTER_FAKE_PROVIDERS,

    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: (backend, defaultOptions) => {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),

    LolApiService,
    ChampionsComponent
  ]);


  it('should call getData() on contruct', inject([Router, LolApiService], (router, service) => {
    spyOn(ChampionsComponent.prototype, 'getData');
    expect(ChampionsComponent.prototype.getData).not.toHaveBeenCalled();
    let component = new ChampionsComponent(router, service);
    expect(ChampionsComponent.prototype.getData).toHaveBeenCalled();
  }));


  it('should get champions', async(inject([MockBackend, ChampionsComponent, LolApiService], (mockBackend, component, service) => {
    let mockResponse = new Response(new ResponseOptions({ status: 200, body: [{}] }));
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    expect(component.champions).not.toBeDefined();
    component.getData();
    return service.getChampions().toPromise().then(() => {
      expect(component.champions).toBeDefined();
    }).catch(() => {
      expect(false).toBeTruthy();
    });
  })));

  it('should not get champions', async(inject([MockBackend, ChampionsComponent, LolApiService], (mockBackend, component, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockError();
      });

    expect(component.champions).not.toBeDefined();
    component.getData();
    return service.getChampions().toPromise().then(() => {
      expect(false).toBeTruthy();
    }).catch(() => {
      expect(component.champions).not.toBeDefined();
      expect(component.error).toBeTruthy();
    });
  })));


  it('should navigate when enter is hit and one champion is available', inject([ChampionsComponent], (component) => {
    spyOn(component.router, 'navigate');
    expect(component.router.navigate).not.toHaveBeenCalled();
    component.champions = { data: [{ key: 'Aatrox', name: 'Aatrox', tags: ['Fighter', 'Tank'], info: { 'defense': 4, 'magic': 3, 'difficulty': 4, 'attack': 8 } }] };
    component.enterHit();
    expect(component.router.navigate).toHaveBeenCalled();
  }));

  it('should not navigate when enter is hit and multiple champions are available', inject([ChampionsComponent], (component) => {
    spyOn(component.router, 'navigate');
    expect(component.router.navigate).not.toHaveBeenCalled();
    component.champions = {
      data: [
        { key: 'Aatrox', name: 'Aatrox', tags: ['Fighter', 'Tank'], info: { defense: 4, magic: 3, difficulty: 4, attack: 8 } },
        { key: 'Thresh', name: 'Aatrox', tags: ['Fighter', 'Support'], info: { defense: 6, magic: 6, difficulty: 7, attack: 5 } }
      ]
    };
    component.enterHit();
    expect(component.router.navigate).not.toHaveBeenCalled();
  }));
});
