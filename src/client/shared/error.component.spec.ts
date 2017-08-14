import {inject, TestBed} from '@angular/core/testing';

import {ErrorComponent} from './error.component';

describe('ErrorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ErrorComponent]});
  });

  it('should be initialised', inject([ErrorComponent], (component) => {
       expect(component.error).toBeFalsy();
       expect(component.message).toBe('Something went wrong.. ');
     }));
});
