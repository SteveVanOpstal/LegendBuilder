import {provide, ElementRef} from '@angular/core';

import {it, inject, beforeEachProviders} from '@angular/core/testing';

import {GraphComponent} from './graph.component';

import {MockElementRef} from '../../testing';

describe('GraphComponent', () => {
  beforeEachProviders(() => [
    provide(ElementRef, { useValue: new MockElementRef() }),

    GraphComponent
  ]);


  it('should initialise', inject([GraphComponent], (component) => {
  }));
});
