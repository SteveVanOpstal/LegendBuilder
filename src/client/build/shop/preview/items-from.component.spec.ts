import {addProviders, inject, it} from '@angular/core/testing';

import {ItemsFromComponent} from './items-from.component';

describe('ItemsFromComponent', () => {
  beforeEach(() => {
    addProviders([ItemsFromComponent]);
  });

  it('should be initialised', inject([ItemsFromComponent], (component) => {
       expect(component.items).not.toBeDefined();
       expect(component.itemSelected).toBeDefined();
       expect(component.itemPicked).toBeDefined();
     }));
});
