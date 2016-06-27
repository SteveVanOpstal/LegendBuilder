import {beforeEachProviders, inject, it} from '@angular/core/testing';

import {ItemComponent} from './item.component';

describe('ItemComponent', () => {
  beforeEachProviders(() => [ItemComponent]);

  it('should be initialised', inject([ItemComponent], (component) => {
       expect(component.item).not.toBeDefined();
     }));
});
