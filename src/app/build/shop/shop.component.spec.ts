import {provide} from 'angular2/core';
import {BaseRequestOptions, Http, Response, ResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, injectAsync, beforeEachProviders, beforeEach} from 'angular2/testing';
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
      useFactory: function (backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),
    provide(Event, { useValue: new MockEvent() }),

    LolApiService,
    ShopComponent
  ]);

  let pickedItem1 = { id: 1, group: 'PinkWards' };
  let pickedItem2 = { id: 2, group: 'PinkWards' };
  let pickedItem3 = {};
  let pickedItem4 = { id: 4, group: 'DoransItems' };
  let items = {
    groups: [
      {
        MaxGroupOwnable: 2,
        key: 'PinkWards'
      },
      {
        MaxGroupOwnable: -1,
        key: 'DoransItems'
      }
    ]
  };



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
      expect(component.items).toBeDefined();
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


  it('should emit pickeditem', inject([ShopComponent], (component) => {
    spyOn(component.itemPicked, 'next');
    component.items = items;
    component.leftClick(pickedItem2);
    expect(component.itemPicked.next).toHaveBeenCalled();
  }));

  // it('should replace the first picked item with the new picked item', inject([ShopComponent], (component) => {
  //   component.pickedItems = [pickedItem1, pickedItem1];
  //   component.items = items;
  //   component.itemPicked(pickedItem2);
  //   expect(component.pickedItems.length).toBe(2);
  //   expect(component.pickedItems[0]).toHaveEqualContent(pickedItem2);
  // }));

  // it('should not mark an item as MaxOwnableExceeded when it has no group', inject([ShopComponent], (component) => {
  //   component.pickedItems = [];
  //   component.items = items;
  //   component.itemPicked(pickedItem3);
  //   expect(component.pickedItems[0]).toHaveEqualContent(pickedItem3);
  // }));

  // it('should not mark an item as MaxOwnableExceeded when it has a MaxGroupOwnable of -1', inject([ShopComponent], (component) => {
  //   component.pickedItems = [];
  //   component.items = items;
  //   component.itemPicked(pickedItem4);
  //   expect(component.pickedItems[0]).toHaveEqualContent(pickedItem4);
  // }));
});
