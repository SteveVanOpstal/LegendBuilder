import {TestBed, inject} from '@angular/core/testing';

import {ErrorComponent} from './error.component';

describe('ErrorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ErrorComponent]});
  });

  it('should be initialised', inject([ErrorComponent], (component) => {
       expect(component.error).toBeFalsy();
       expect(component.retry).toBeDefined();
     }));

  it('should emit retry event', inject([ErrorComponent], (component) => {
       spyOn(component.retry, 'emit');
       expect(component.retry.emit).not.toHaveBeenCalled();
       component.retryClicked();
       expect(component.retry.emit).toHaveBeenCalled();
     }));
});
