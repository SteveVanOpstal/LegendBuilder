import {provide} from '@angular/core';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {Router, RouteSegment} from '@angular/router';

import {it, inject, async, beforeEachProviders} from '@angular/core/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {ROUTER_FAKE_PROVIDERS} from '@angular/router/testing';

import {LolApiService} from '../misc/lolapi.service';
import {Samples} from '../build/samples';
import {BuildComponent} from './build.component';

import {MockRouteSegment} from '../testing';

describe('BuildComponent', () => {
  beforeEachProviders(() => [
    ROUTER_FAKE_PROVIDERS,
    provide(RouteSegment, { useValue: new MockRouteSegment({ region: 'euw', champion: 'VelKoz' }) }),

    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: (backend, defaultOptions) => {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),

    LolApiService,
    BuildComponent
  ]);


  it('should be initialised', inject([BuildComponent], (component) => {
    expect(component.championKey).toBe('VelKoz');
    expect(component.champion).not.toBeDefined();
    expect(component.loading).toBeTruthy();
    expect(component.error).toBeFalsy();
  }));


  it('should call getData() on contruct', inject([RouteSegment, LolApiService], (routeSegment, service) => {
    spyOn(BuildComponent.prototype, 'getData');
    expect(BuildComponent.prototype.getData).not.toHaveBeenCalled();
    let component = new BuildComponent(routeSegment, service);
    expect(BuildComponent.prototype.getData).toHaveBeenCalled();
  }));

  it('should call getMatchData() on contruct', inject([RouteSegment, LolApiService], (routeSegment, service) => {
    spyOn(BuildComponent.prototype, 'getMatchData');
    expect(BuildComponent.prototype.getMatchData).not.toHaveBeenCalled();
    let component = new BuildComponent(routeSegment, service);
    expect(BuildComponent.prototype.getMatchData).toHaveBeenCalled();
  }));


  it('should handle a champion request', async(inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
    let mockResponse = new Response(new ResponseOptions({ status: 200, body: [{}] }));
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    expect(component.champion).not.toBeDefined();
    component.getData();
    return service.getChampion('VelKoz').toPromise().then(() => {
      expect(component.champion).toBeDefined();
    }).catch(() => {
      expect(false).toBeTruthy();
    });
  })));

  it('should handle a champion error', async(inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockError();
      });

    expect(component.champion).not.toBeDefined();
    component.getData();
    return service.getChampion('VelKoz').toPromise().then(() => {
      expect(false).toBeTruthy();
    }).catch(() => {
      expect(component.champion).not.toBeDefined();
      expect(component.error).toBeTruthy();
    });
  })));


  it('should handle a match request', async(inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
    let samples = { xp: [0, 1], g: [0, 1] };
    let mockResponse = new Response(new ResponseOptions({ status: 200, body: { xp: [0, 1], g: [0, 1] } }));
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    expect(component.samples).toBeDefined();
    component.getMatchData('');
    return service.getMatchData('', '', 0, 0).toPromise().then(() => {
      expect(component.samples).toHaveEqualContent(samples);
    }).catch(() => {
      expect(false).toBeTruthy();
    });
  })));

  it('should handle a match error', async(inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
    let samples = { xp: [0, 1], g: [0, 1] };
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockError();
      });

    expect(component.samples).toBeDefined();
    component.getMatchData('');
    return service.getMatchData('', '', 0, 0).toPromise().then(() => {
      expect(false).toBeTruthy();
    }).catch(() => {
      expect(component.samples).not.toHaveEqualContent(samples);
      expect(component.error).toBeTruthy();
    });
  })));
});
