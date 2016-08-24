import {inject, TestBed} from '@angular/core/testing';

import {LoadingComponent} from './loading.component';

describe('LoadingComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [LoadingComponent]});
  });

  it('should be initialised', inject([LoadingComponent], (component) => {
       expect(component.loading).not.toBeDefined();
     }));
});
