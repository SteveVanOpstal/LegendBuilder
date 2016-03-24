import {provide} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {Router, RouteRegistry, Location, ROUTER_PRIMARY_COMPONENT, RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, beforeEachProviders} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';
import {SpyLocation} from 'angular2/src/mock/location_mock';

import {LolApiService} from '../misc/lolapi.service';
import {ChampionsComponent} from './champions.component';

describe('ChampionsComponent', () => {
  beforeEachProviders(() => [
    RouteRegistry,
    provide(Location, { useClass: SpyLocation }),
    provide(ROUTER_PRIMARY_COMPONENT, { useValue: ChampionsComponent }),
    provide(Router, { useClass: RootRouter }),
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
    ChampionsComponent
  ]);


  it('should call getData() on contruct', inject([RouteParams, Router, LolApiService], (routeParams, router, service) => {
    let component = new ChampionsComponent(routeParams, router, service);
    expect(component.champions).not.toBeDefined();
    setTimeout(function() {
      expect(component.champions).toBeDefined();
    }, 500);
  }));

  it('should have RouteParam region \'euw\'', inject([ChampionsComponent], (component) => {
    expect(component.region).toEqual('euw');
  }));

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
    component.champions = { data: [
      { key: 'Aatrox', name: 'Aatrox', tags: ['Fighter', 'Tank'], info: { defense: 4, magic: 3, difficulty: 4, attack: 8 } },
      { key: 'Thresh', name: 'Aatrox', tags: ['Fighter', 'Support'], info: { defense: 6, magic: 6, difficulty: 7, attack: 5 } }
    ]};
    component.enterHit();
    expect(component.router.navigate).not.toHaveBeenCalled();
  }));
});
