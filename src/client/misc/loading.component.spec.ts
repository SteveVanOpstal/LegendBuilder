import {addProviders, inject} from '@angular/core/testing';

import {LoadingComponent} from './loading.component';

describe('LoadingComponent', () => {
  beforeEach(() => {
    addProviders([LoadingComponent]);
  });

  it('should be initialised', inject([LoadingComponent], (component) => {
       expect(component.loading).not.toBeDefined();
     }));
});
