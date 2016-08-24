import {inject, TestBed} from '@angular/core/testing';

import {DataScale} from '../scales/data';

import {DataAxis} from './data';

describe('DataAxis', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [DataAxis]});
  });

  it('should set axis on create', inject([DataAxis], (component) => {
       expect(component.axis).not.toBeDefined();
       component.create(new DataScale());
       expect(component.axis).toBeDefined();
     }));

  it('should return axis on get', inject([DataAxis], (component) => {
       expect(component.axis).not.toBeDefined();
       component.create(new DataScale());
       expect(component.get()).toHaveEqualContent(component.axis);
     }));
});
