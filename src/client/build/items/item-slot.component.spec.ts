import {TestBed, inject} from '@angular/core/testing';

import {settings} from '../../../../config/settings';

import {ItemSlotComponent} from './item-slot.component';
import {ItemsComponent} from './items.component';

describe('ItemSlotComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ItemsComponent, ItemSlotComponent]});
  });

  let item1;
  let item2;

  beforeEach(inject([ItemSlotComponent], (component) => {
    item1 = {id: 3341, gold: {total: 0}};

    item2 = {id: 2003, gold: {total: 50}};

    component.samples = {gold: [0, 100, 200, 300]};
    component.items = [item1, item2, item2, item2];
  }));

  it('should add an item', inject([ItemSlotComponent], (component) => {
       spyOn(component, 'addTime');
       spyOn(component, 'addBundle');
       expect(component.addTime).not.toHaveBeenCalled();
       expect(component.addBundle).not.toHaveBeenCalled();
       component.addItem(item1);
       expect(component.addTime).toHaveBeenCalled();
       expect(component.addBundle).toHaveBeenCalled();
       expect(component.items[4]).toHaveEqualContent(item1);
     }));

  it('should calculate time', inject([ItemSlotComponent], (component) => {
       component.addTime(item1);
       expect(item1.time).toBe(0);
       component.addTime(item2);
       expect(item2.time)
           .toBe(
               (settings.gameTime / settings.matchServer.sampleSize) / component.samples.gold[1] *
               item2.gold.total);
     }));

  it('should bundle', inject([ItemSlotComponent], (component) => {
       component.addTime(item2);
       component.addBundle(item2);
       expect(component.items.length).toBe(2);
       expect(component.items[1].bundle).toBe(3);
     }));
});
