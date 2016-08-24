import {inject, TestBed} from '@angular/core/testing';

import {ItemComponent} from './item.component';

describe('ItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ItemComponent]});
  });

  it('should be initialised', inject([ItemComponent], (component) => {
       expect(component.item).not.toBeDefined();
     }));
});
