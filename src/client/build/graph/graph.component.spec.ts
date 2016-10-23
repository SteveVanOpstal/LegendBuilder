import {ElementRef} from '@angular/core';
import {inject, TestBed} from '@angular/core/testing';

import {BuildService} from '../../services/build.service';
import {MockElementRef} from '../../testing';

import {GraphComponent} from './graph.component';

describe('GraphComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:
          [BuildService, GraphComponent, {provide: ElementRef, useValue: new MockElementRef()}]
    });
  });

  it('should initialise', inject([GraphComponent], (component) => {}));
});
