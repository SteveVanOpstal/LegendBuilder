import {addProviders, inject} from '@angular/core/testing';

import {ItemsComponent} from './items.component';

// class MockItemSlotComponent implements ItemSlotComponent {

// }

describe('ItemsComponent', () => {
  beforeEach(() => {
    addProviders([ItemsComponent]);
  });

  beforeEach(inject([ItemsComponent], (component) => {
    component.samples = {gold: [100, 200, 300], gameTime: 200, sampleSize: 20};
    component.itemSlotComponents = [
      {'id': 3341, 'gold': {'total': 0}}, {'id': 2003, 'gold': {'total': 50}},
      {'id': 2003, 'gold': {'total': 50}}, {'id': 2003, 'gold': {'total': 50}}
    ];
  }));

  // it('should add item', inject([ItemsComponent], (component) => {
  //   spyOn(component, 'addTime');
  //   spyOn(component, 'addBundle');
  //   expect(component.addTime).not.toHaveBeenCalled();
  //   expect(component.addBundle).not.toHaveBeenCalled();
  //   component.ngDoCheck();
  //   expect(component.addTime).toHaveBeenCalled();
  //   expect(component.addBundle).toHaveBeenCalled();
  // }));
});
