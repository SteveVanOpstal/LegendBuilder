import {provide} from 'angular2/core';
import {BaseRequestOptions, Http, Response, ResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, injectAsync, beforeEachProviders} from 'angular2/testing';
import {MockBackend, MockConnection} from 'angular2/http/testing';

import {LolApiService} from '../../misc/lolapi.service';
import {ShopComponent} from './shop.component';

class MockEvent {
  public target: any;
}

describe('ShopComponent', () => {
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
    provide(Event, { useValue: new MockEvent() }),

    LolApiService,
    ShopComponent
  ]);



  it('should call getData() on contruct', inject([LolApiService], (service) => {
    spyOn(ShopComponent.prototype, 'getData');
    expect(ShopComponent.prototype.getData).not.toHaveBeenCalled();
    let component = new ShopComponent(service);
    expect(ShopComponent.prototype.getData).toHaveBeenCalled();
  }));


  it('should get items', injectAsync([MockBackend, ShopComponent, LolApiService], (mockBackend, component, service) => {
    let mockResponse = new Response(new ResponseOptions({ status: 200, body: [{}] }));
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    expect(component.items).not.toBeDefined();
    component.getData();
    return service.getItems().toPromise().then(() => {
      expect(component.data).toBeDefined();
    });
  }));

  it('should not get items', injectAsync([MockBackend, ShopComponent, LolApiService], (mockBackend, component, service) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockError();
      });

    expect(component.items).not.toBeDefined();
    component.getData();
    return service.getItems().toPromise().catch(() => {
      expect(component.items).not.toBeDefined();
    });
  }));


  it('should add tags', inject([ShopComponent, Event], (component, event) => {
    expect(component.tags).not.toContain('HEALTH');
    event.target = { checked: true, value: 'HEALTH' };
    component.tagChanged(event);
    expect(component.tags).toContain('HEALTH');
  }));

  it('should not add tags on null event', inject([ShopComponent, Event], (component, event) => {
    component.tags = null;
    expect(component.tags).toBe(null);
    component.tagChanged(null);
    expect(component.tags).toBe(null);
    event.target = null;
    component.tagChanged(event);
    expect(component.tags).toBe(null);
  }));

  it('should add multiple tags', inject([ShopComponent, Event], (component, event) => {
    expect(component.tags).not.toContain('HEALTH');
    event.target = { checked: true, value: 'HEALTH' };
    component.tagChanged(event);
    expect(component.tags).toContain('HEALTH');
    expect(component.tags).not.toContain('ARMOR');
    event.target = { checked: true, value: 'ARMOR' };
    component.tagChanged(event);
    expect(component.tags).toContain('HEALTH');
    expect(component.tags).toContain('ARMOR');
  }));

  it('should remove tags', inject([ShopComponent, Event], (component, event) => {
    component.tags = ['HEALTH'];
    event.target = { checked: false, value: 'HEALTH' };
    component.tagChanged(event);
    expect(component.tags).not.toContain('HEALTH');
  }));
});
