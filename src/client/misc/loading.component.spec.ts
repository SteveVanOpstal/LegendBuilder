import {beforeEachProviders, inject, it} from '@angular/core/testing';

import {LoadingComponent} from './loading.component';

describe('LoadingComponent', () => {
  beforeEachProviders(() => [LoadingComponent]);

  it('should be initialised', inject([LoadingComponent], (component) => {
       expect(component.loading).not.toBeDefined();
     }));
});
