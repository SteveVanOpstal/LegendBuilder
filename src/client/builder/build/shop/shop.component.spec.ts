import {ReflectiveInjector} from '@angular/core';
import {async, inject, TestBed} from '@angular/core/testing';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
import {Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {LolApiService, PickedItemsService} from '../../../services';
import {TestModule} from '../../../testing';

import {ShopComponent} from './shop.component';

xdescribe('ShopComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [ShopComponent, LolApiService, PickedItemsService], imports: [TestModule]});
    // TestBed.configureTestingModule(
    //     {providers: [ShopComponent, LolApiService, PickedItemsService], imports: [TestModule]});
    this.injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions}, Http, ShopComponent, LolApiService,
      PickedItemsService
    ]);
    this.backend = this.injector.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
  });

  // let pickedItem1 = {id: 1, group: 'PinkWards'};
  const pickedItem2 = {id: 2, group: 'PinkWards'};
  // let pickedItem3 = {};
  // let pickedItem4 = {id: 4, group: 'DoransItems'};
  const items = {
    groups: [{MaxGroupOwnable: 2, key: 'PinkWards'}, {MaxGroupOwnable: -1, key: 'DoransItems'}]
  };

  it('should get items', async(inject([ShopComponent], (component) => {
       expect(component.items).toHaveEqualContent([]);
       expect(component.originalItems).toHaveEqualContent([]);
       component.ngOnInit();
       this.lastConnection.mockRespond(new Response(new ResponseOptions({status: 200, body: {}})));
       expect(component.items).not.toHaveEqualContent({});
       expect(component.originalItems).not.toHaveEqualContent({});
     })));

  it('should not get items', async(inject([MockBackend, ShopComponent], (backend, component) => {
       expect(component.items).toHaveEqualContent([]);
       expect(component.originalItems).toHaveEqualContent([]);
       component.ngOnInit();
       backend.error();
       expect(component.items).toHaveEqualContent([]);
       expect(component.originalItems).toHaveEqualContent([]);
     })));

  it('should add tags', inject([ShopComponent, Event], (component, event) => {
       expect(component.tags).not.toContain('HEALTH');
       event.target = {checked: true, value: 'HEALTH'};
       component.tagChanged(event);
       expect(component.tags).toContain('HEALTH');
     }));

  it('should not add tags on undefined event',
     inject([ShopComponent, Event], (component, event) => {
       component.tags = undefined;
       expect(component.tags).toBe(undefined);
       component.tagChanged(undefined);
       expect(component.tags).toBe(undefined);
       event.target = undefined;
       component.tagChanged(event);
       expect(component.tags).toBe(undefined);
     }));

  it('should add multiple tags', inject([ShopComponent, Event], (component, event) => {
       expect(component.tags).not.toContain('HEALTH');
       event.target = {checked: true, value: 'HEALTH'};
       component.tagChanged(event);
       expect(component.tags).toContain('HEALTH');
       expect(component.tags).not.toContain('ARMOR');
       event.target = {checked: true, value: 'ARMOR'};
       component.tagChanged(event);
       expect(component.tags).toContain('HEALTH');
       expect(component.tags).toContain('ARMOR');
     }));

  it('should remove tags', inject([ShopComponent, Event], (component, event) => {
       component.tags = ['HEALTH'];
       event.target = {checked: false, value: 'HEALTH'};
       component.tagChanged(event);
       expect(component.tags).not.toContain('HEALTH');
     }));

  it('should emit pickeditem', inject([ShopComponent], (component) => {
       spyOn(component.itemPicked, 'emit');
       component.items = items;
       component.pickItem(pickedItem2);
       expect(component.itemPicked.emit).toHaveBeenCalled();
     }));

  // it('should replace the first picked item with the new picked item',
  // inject([ShopComponent], (component) => {
  //   component.pickedItems = [pickedItem1, pickedItem1];
  //   component.items = items;
  //   component.itemPicked(pickedItem2);
  //   expect(component.pickedItems.length).toBe(2);
  //   expect(component.pickedItems[0]).toHaveEqualContent(pickedItem2);
  // }));

  // it('should not mark an item as MaxOwnableExceeded when it has no group',
  // inject([ShopComponent], (component) => {
  //   component.pickedItems = [];
  //   component.items = items;
  //   component.itemPicked(pickedItem3);
  //   expect(component.pickedItems[0]).toHaveEqualContent(pickedItem3);
  // }));

  // it('should not mark an item as MaxOwnableExceeded when it has a
  // MaxGroupOwnable of -1', inject([ShopComponent], (component) => {
  //   component.pickedItems = [];
  //   component.items = items;
  //   component.itemPicked(pickedItem4);
  //   expect(component.pickedItems[0]).toHaveEqualContent(pickedItem4);
  // }));
});
