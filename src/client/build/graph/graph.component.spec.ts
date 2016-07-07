import {ElementRef, provide} from '@angular/core';
import {addProviders, inject, it} from '@angular/core/testing';

import {MockElementRef} from '../../testing';

import {GraphComponent} from './graph.component';

describe('GraphComponent', () => {
  beforeEach(() => {
    addProviders([GraphComponent, {provide: ElementRef, useValue: new MockElementRef()}]);
  });

  it('should initialise', inject([GraphComponent], (component) => {}));
});
