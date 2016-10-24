import {ElementRef} from '@angular/core';
import {inject, TestBed} from '@angular/core/testing';

import {DataService} from '../../services/data.service';
import {MockElementRef} from '../../testing';

import {GraphComponent} from './graph.component';

describe('GraphComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:
          [DataService, GraphComponent, {provide: ElementRef, useValue: new MockElementRef()}]
    });
  });

  it('should initialise', inject([GraphComponent], (component) => {}));
});
