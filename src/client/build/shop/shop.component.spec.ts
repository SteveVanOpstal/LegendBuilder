import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {LolApiService} from '../../services/lolapi.service';
import {TestModule} from '../../testing';

import {ShopComponent} from './shop.component';

describe('ShopComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [ShopComponent, LolApiService], imports: [TestModule]});
  });

  // let pickedItem1 = {id: 1, group: 'PinkWards'};
  let pickedItem2 = {id: 2, group: 'PinkWards'};
  // let pickedItem3 = {};
  // let pickedItem4 = {id: 4, group: 'DoransItems'};
  let items = {
    groups: [{MaxGroupOwnable: 2, key: 'PinkWards'}, {MaxGroupOwnable: -1, key: 'DoransItems'}]
  };

  it('should get items', async(inject([MockBackend, ShopComponent], (backend, component) => {
       expect(component.items).toHaveEqualContent([]);
       expect(component.originalItems).toHaveEqualContent([]);
       component.ngOnInit();
       backend.success();
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
