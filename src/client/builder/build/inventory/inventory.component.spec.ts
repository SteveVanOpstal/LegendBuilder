import {inject, TestBed} from '@angular/core/testing';

import {settings} from '../../../../../config/settings';
import {LolApiService} from '../../../services/lolapi.service';
import {TestModule} from '../../../testing';
import {StatsService} from '../services/stats.service';

import {InventoryComponent} from './inventory.component';

describe('InventoryComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [InventoryComponent, LolApiService, StatsService], imports: [TestModule]});
  });

  beforeEach(inject([InventoryComponent], (component) => {
    component.samples = {gold: [100, 200, 300], gameTime: 200, sampleSize: 20};
    component.itemSlotComponents = [
      {'id': 3341, 'gold': {'total': 0}}, {'id': 2003, 'gold': {'total': 50}},
      {'id': 2003, 'gold': {'total': 50}}, {'id': 2003, 'gold': {'total': 50}}
    ];
  }));

  let item1;
  let item2;

  beforeEach(inject([InventoryComponent], (component) => {
    item1 = {item: {id: 3341, gold: {total: 0}}, slotId: 0};
    item2 = {item: {id: 2003, gold: {total: 50}}, slotId: 0};

    component.samples = {gold: [0, 100, 200, 300]};
    component.slotItems = [item1, item2, item2, item2];
  }));

  // it('should add item', inject([InventoryComponent], (component) => {
  //   spyOn(component, 'addTime');
  //   spyOn(component, 'addBundle');
  //   expect(component.addTime).not.toHaveBeenCalled();
  //   expect(component.addBundle).not.toHaveBeenCalled();
  //   component.ngDoCheck();
  //   expect(component.addTime).toHaveBeenCalled();
  //   expect(component.addBundle).toHaveBeenCalled();
  // }));

  xit('should add an item', inject([InventoryComponent], (component) => {
        spyOn(component, 'addTime');
        spyOn(component, 'addBundle');
        expect(component.addTime).not.toHaveBeenCalled();
        //  expect(component.addBundle).not.toHaveBeenCalled();
        component.addItem(item1);
        expect(component.addTime).toHaveBeenCalled();
        //  expect(component.addBundle).toHaveBeenCalled();
        expect(component.items[4]).toHaveEqualContent(item1);
      }));

  xit('should calculate time', inject([InventoryComponent], (component) => {
        component.addTime(item1);
        expect(item1.time).toBe(0);
        component.addTime(item2);
        expect(item2.time)
            .toBe(
                (settings.match.gameTime / settings.match.sampleSize) / component.samples.gold[1] *
                item2.gold.total);
      }));

  xit('should bundle', inject([InventoryComponent], (component) => {
        component.addTime(item2);
        component.addBundle(item2);
        expect(component.items.length).toBe(2);
        expect(component.items[1].bundle).toBe(3);
      }));
});
