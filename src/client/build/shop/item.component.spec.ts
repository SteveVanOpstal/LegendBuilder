import {addProviders, inject, it} from '@angular/core/testing';

import {ItemComponent} from './item.component';

describe('ItemComponent', () => {
  beforeEach(() => {
    addProviders([ItemComponent]);
  });

  it('should be initialised', inject([ItemComponent], (component) => {
       expect(component.item).not.toBeDefined();
     }));
});
