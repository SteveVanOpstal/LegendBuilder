import {provide} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {Router, RouteRegistry, Location, ROUTER_PRIMARY_COMPONENT, RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, beforeEachProviders} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';
import {SpyLocation} from 'angular2/src/mock/location_mock';

import {ChampionsComponent} from '../app/choose/champions.component';
import {LolApiService} from '../app/misc/lolapi.service';

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
    spyOn(ChampionsComponent.prototype, 'getData');
    expect(ChampionsComponent.prototype.getData).not.toHaveBeenCalled();
    let component = new ChampionsComponent(routeParams, router, service);
    expect(ChampionsComponent.prototype.getData).toHaveBeenCalled();
  }));


  it('should have RouteParam region \'euw\'', inject([ChampionsComponent], (component) => {
    expect(component.region).toEqual('euw');
  }));

});
