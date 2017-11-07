import {inject, TestBed} from '@angular/core/testing';

import {TestModule} from '../../../../testing';

import {SortFilterComponent} from './sort-filter.component';

describe('SortFilterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [SortFilterComponent], imports: [TestModule]});
  });

  it('should not emit sortChange on incorrect event',
     inject([SortFilterComponent, Event], (component, event) => {
       spyOn(component.sortChange, 'next');
       expect(component.sortChange.next).not.toHaveBeenCalled();
       component.sortChanged(undefined);
       expect(component.sortChange.next).not.toHaveBeenCalled();
       event.target = undefined;
       component.sortChanged(event);
       expect(component.sortChange.next).not.toHaveBeenCalled();
     }));

  it('should update and emit sort', inject([SortFilterComponent, Event], (component, event) => {
       spyOn(component.sortChange, 'next');
       expect(component.sortChange.next).not.toHaveBeenCalled();
       event.target = {value: 'attack'};
       component.sortChanged(event);
       expect(component.sort).toBe('attack');
       expect(component.sortChange.next).toHaveBeenCalled();
     }));
});
