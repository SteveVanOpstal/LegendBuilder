import {ElementRef} from 'angular2/core';

import {it, inject, injectAsync, beforeEachProviders} from 'angular2/testing';

import {GraphComponent} from './graph.component';

describe('GraphComponent', () => {
  beforeEachProviders(() => [
    ElementRef,

    GraphComponent
  ]);


  it('should initialise', inject([GraphComponent], (component) => {
    expect(component.margin).toBeDefined();
    expect(component.width).toBeDefined();
    expect(component.height).toBeDefined();
    expect(component.abilitiesWidth).toBeDefined();
    expect(component.abilitiesHeight).toBeDefined();
    expect(component.graphWidth).toBeDefined();
    expect(component.graphHeight).toBeDefined();
  }));
});
