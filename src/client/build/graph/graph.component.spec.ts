import {ElementRef} from '@angular/core';
import {inject, TestBed} from '@angular/core/testing';

import {MockElementRef} from '../../testing';

import {GraphComponent} from './graph.component';

describe('GraphComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [GraphComponent, {provide: ElementRef, useValue: new MockElementRef()}]});
  });

  it('should initialise', inject([GraphComponent], (component) => {}));
});
