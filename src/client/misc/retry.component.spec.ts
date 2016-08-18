import {TestBed, inject} from '@angular/core/testing';

import {RetryComponent} from './retry.component';

describe('RetryComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [RetryComponent]});
  });

  it('should be initialised', inject([RetryComponent], (component) => {
       expect(component.error).toBeFalsy();
       expect(component.retry).toBeDefined();
     }));

  it('should emit retry event', inject([RetryComponent], (component) => {
       spyOn(component.retry, 'emit');
       expect(component.retry.emit).not.toHaveBeenCalled();
       component.retryClicked();
       expect(component.retry.emit).toHaveBeenCalled();
     }));
});
