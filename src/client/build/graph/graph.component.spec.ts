import {ElementRef} from '@angular/core';
import {TestBed, inject} from '@angular/core/testing';

import {MockElementRef} from '../../testing';

import {GraphComponent} from './graph.component';

describe('GraphComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [GraphComponent, {provide: ElementRef, useValue: new MockElementRef()}]});
  });

  it('should initialise', inject([GraphComponent], (component) => {}));
});
