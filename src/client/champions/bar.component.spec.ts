import {provide} from '@angular/core';
import {addProviders, inject, it} from '@angular/core/testing';

import {BarComponent} from './bar.component';

describe('BarComponent', () => {
  beforeEach(() => {
    addProviders([BarComponent]);
  });

  it('should be initialised', inject([BarComponent], (component) => {
       expect(component.value).not.toBeDefined();
       expect(component.range).not.toBeDefined();
     }));

  it('should repeat', inject([BarComponent], (component) => {
       component.value = 2;
       expect(component.repeat().length).toBe(2);
     }));
});
