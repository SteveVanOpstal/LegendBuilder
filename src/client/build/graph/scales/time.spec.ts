import {addProviders, inject} from '@angular/core/testing';

import {TimeScale} from './time';

describe('TimeScale', () => {
  beforeEach(() => {
    addProviders([TimeScale]);
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
