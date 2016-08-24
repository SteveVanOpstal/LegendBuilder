import {ElementRef} from '@angular/core';
import {inject, TestBed} from '@angular/core/testing';

import {MockElementRef} from '../../testing';

import {ItemComponent} from './item.component';

describe('ItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [ItemComponent, {provide: ElementRef, useValue: new MockElementRef()}]});
  });

  it('should be initialised', inject([ItemComponent], (component) => {
       expect(component.item).not.toBeDefined();
     }));
});
