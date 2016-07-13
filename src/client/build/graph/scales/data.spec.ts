import {addProviders, inject} from '@angular/core/testing';

import {DataScale} from './data';

describe('DataScale', () => {
  beforeEach(() => {
    addProviders([DataScale]);
  });

  it('should set scale on create', inject([DataScale], (component) => {
       expect(component.scale).not.toBeDefined();
       component.create();
       expect(component.scale).toBeDefined();
     }));

  it('should return scale on get', inject([DataScale], (component) => {
       expect(component.scale).not.toBeDefined();
       component.create();
       expect(component.get()).toHaveEqualContent(component.scale);
     }));
});
