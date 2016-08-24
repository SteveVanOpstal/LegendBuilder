import {inject, TestBed} from '@angular/core/testing';

import {TimeScale} from './time';

describe('TimeScale', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [TimeScale]});
  });

  it('should set scale on create', inject([TimeScale], (component) => {
       expect(component.scale).not.toBeDefined();
       component.create();
       expect(component.scale).toBeDefined();
     }));

  it('should return scale on get', inject([TimeScale], (component) => {
       expect(component.scale).not.toBeDefined();
       component.create();
       expect(component.get()).toHaveEqualContent(component.scale);
     }));
});
