import {provide} from 'angular2/core';
import {it, inject} from 'angular2/testing';

import {BarComponent} from './bar.component';


describe('BarComponent', () => {
  beforeEachProviders(() => [
    BarComponent
  ]);


  it('should be initialised', inject([BarComponent], (component) => {
    expect(component.value).not.toBeDefined();
    expect(component.range).not.toBeDefined();
  }));

  it('should repeat', inject([BarComponent], (component) => {
    component.value = 2;
    expect(component.repeat().length).toBe(2);
  }));
});
