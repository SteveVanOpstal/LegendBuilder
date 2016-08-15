import {TestBed, inject} from '@angular/core/testing';

import {TimeScale} from '../scales/time';
import {TimeAxis} from './time';

describe('TimeAxis', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [TimeAxis]});
  });

  it('should set axis on create', inject([TimeAxis], (component) => {
       expect(component.axis).not.toBeDefined();
       component.create(new TimeScale());
       expect(component.axis).toBeDefined();
     }));

  it('should return axis on get', inject([TimeAxis], (component) => {
       expect(component.axis).not.toBeDefined();
       component.create(new TimeScale());
       expect(component.get()).toHaveEqualContent(component.axis);
     }));
});
