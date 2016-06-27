import {beforeEachProviders, inject, it} from '@angular/core/testing';

import {ItemComponent} from './item.component';

describe('ItemComponent', () => {
  beforeEachProviders(() => [ItemComponent]);

  it('should be initialised', inject([ItemComponent], (component) => {
       expect(component.item).not.toBeDefined();
     }));

  it('should emit itemSelected event', inject([ItemComponent], (component) => {
       spyOn(component.itemSelected, 'emit');
       expect(component.itemSelected.emit).not.toHaveBeenCalled();
       component.selectItem({});
       expect(component.itemSelected.emit).toHaveBeenCalled();
     }));

  it('should emit itemPicked event', inject([ItemComponent], (component) => {
       spyOn(component.itemPicked, 'emit');
       expect(component.itemPicked.emit).not.toHaveBeenCalled();
       let result = component.pickItem({});
       expect(result).toBeFalsy();
       expect(component.itemPicked.emit).toHaveBeenCalled();
     }));
});
