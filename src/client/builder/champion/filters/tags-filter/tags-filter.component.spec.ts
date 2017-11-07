import {inject, TestBed} from '@angular/core/testing';

import {TestModule} from '../../../../testing';

import {TagsFilterComponent} from './tags-filter.component';

describe('TagsFilterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [TagsFilterComponent], imports: [TestModule]});
  });

  it('should not emit tagsChange on incorrect event',
     inject([TagsFilterComponent, Event], (component, event) => {
       spyOn(component.tagsChange, 'next');
       expect(component.tagsChange.next).not.toHaveBeenCalled();
       component.tagChanged(undefined);
       expect(component.tagsChange.next).not.toHaveBeenCalled();
       event.target = undefined;
       component.tagChanged(event);
       expect(component.tagsChange.next).not.toHaveBeenCalled();
     }));

  it('should add and emit tags', inject([TagsFilterComponent, Event], (component, event) => {
       spyOn(component.tagsChange, 'next');
       expect(component.tags).not.toContain('Marksman');
       expect(component.tagsChange.next).not.toHaveBeenCalled();
       event.target = {checked: true, value: 'Marksman'};
       component.tagChanged(event);
       expect(component.tags).toContain('Marksman');
       expect(component.tagsChange.next).toHaveBeenCalled();
     }));

  it('should add multiple tags and emit tags',
     inject([TagsFilterComponent, Event], (component, event) => {
       spyOn(component.tagsChange, 'next');
       expect(component.tags).not.toContain('Marksman');
       expect(component.tagsChange.next).not.toHaveBeenCalled();
       event.target = {checked: true, value: 'Marksman'};
       component.tagChanged(event);
       expect(component.tags).toContain('Marksman');
       expect(component.tags).not.toContain('Assassin');
       expect(component.tagsChange.next).toHaveBeenCalled();
       event.target = {checked: true, value: 'Assassin'};
       component.tagChanged(event);
       expect(component.tags).toContain('Marksman');
       expect(component.tags).toContain('Assassin');
       expect(component.tagsChange.next).toHaveBeenCalled();
     }));

  it('should remove and emit tags', inject([TagsFilterComponent, Event], (component, event) => {
       spyOn(component.tagsChange, 'next');
       component.tags = ['Marksman'];
       expect(component.tagsChange.next).not.toHaveBeenCalled();
       event.target = {checked: false, value: 'Marksman'};
       component.tagChanged(event);
       expect(component.tags).not.toContain('Marksman');
       expect(component.tagsChange.next).toHaveBeenCalled();
     }));
});
