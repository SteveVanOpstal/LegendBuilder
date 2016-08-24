import {inject, TestBed} from '@angular/core/testing';

import {ItemsFromComponent} from './items-from.component';

describe('ItemsFromComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ItemsFromComponent]});
  });

  it('should be initialised', inject([ItemsFromComponent], (component) => {
       expect(component.items).not.toBeDefined();
       expect(component.itemSelected).toBeDefined();
       expect(component.itemPicked).toBeDefined();
     }));
});
