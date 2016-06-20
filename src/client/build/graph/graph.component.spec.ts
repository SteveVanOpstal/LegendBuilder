import {ElementRef, provide} from '@angular/core';
import {beforeEachProviders, inject, it} from '@angular/core/testing';

import {MockElementRef} from '../../testing';

import {GraphComponent} from './graph.component';

describe('GraphComponent', () => {
  beforeEachProviders(
      () =>
          [provide(ElementRef, {useValue: new MockElementRef()}),

           GraphComponent]);


  it('should initialise', inject([GraphComponent], (component) => {}));
});
