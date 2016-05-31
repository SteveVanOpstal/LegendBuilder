import {provide} from '@angular/core';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {Router, RouteSegment} from '@angular/router';

import {it, inject, beforeEachProviders} from '@angular/core/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {ROUTER_FAKE_PROVIDERS} from '@angular/router/testing';

import {LolApiService} from '../misc/lolapi.service';
import {Config} from '../build/config';
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


  it('sshould handle a champion request', inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
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

  it('should handle a champion error', inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
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


  it('should handle a match request', inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
    let config = { xp: [0, 1], g: [0, 1] };
    let mockResponse = new Response(new ResponseOptions({ status: 200, body: { xp: [0, 1], g: [0, 1] } }));
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    expect(component.config).toBeDefined();
    component.getMatchData('');
    return service.getMatchData('', '', 0, 0).toPromise().then(() => {
      expect(component.config).toHaveEqualContent(config);
    });
  }));

  it('should handle a match error', inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
    let config = { xp: [0, 1], g: [0, 1] };
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockError();
      });

    expect(component.config).toBeDefined();
    component.getMatchData('');
    return service.getMatchData('', '', 0, 0).toPromise().catch(() => {
      expect(component.config).not.toHaveEqualContent(config);
      expect(component.error).toBeTruthy();
    });
  }));
});
