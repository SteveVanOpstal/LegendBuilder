import {inject, TestBed} from '@angular/core/testing';

import {TestModule} from '../../testing';

import {ItemComponent} from './item.component';

describe('ItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ItemComponent], imports: [TestModule]});
  });

  it('should be initialised', inject([ItemComponent], (component) => {
       expect(component.item).not.toBeDefined();
     }));
});
