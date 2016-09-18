import {inject, TestBed} from '@angular/core/testing';

import {MockEvent, MockKeyboardEvent} from '../../testing';

import {FiltersComponent} from './filters.component';

describe('FiltersComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Event, useValue: new MockEvent()},
        {provide: KeyboardEvent, useValue: new MockKeyboardEvent()},

        FiltersComponent
      ]
    });
  });

  it('should not emit tagsChange on incorrect event',
     inject([FiltersComponent, Event], (component, event) => {
       spyOn(component.tagsChange, 'next');
       expect(component.tagsChange.next).not.toHaveBeenCalled();
       component.tagChanged(undefined);
       expect(component.tagsChange.next).not.toHaveBeenCalled();
       event.target = undefined;
       component.tagChanged(event);
       expect(component.tagsChange.next).not.toHaveBeenCalled();
     }));

  it('should add and emit tags', inject([FiltersComponent, Event], (component, event) => {
       spyOn(component.tagsChange, 'next');
       expect(component.tags).not.toContain('Marksman');
       expect(component.tagsChange.next).not.toHaveBeenCalled();
       event.target = {checked: true, value: 'Marksman'};
       component.tagChanged(event);
       expect(component.tags).toContain('Marksman');
       expect(component.tagsChange.next).toHaveBeenCalled();
     }));

  it('should add multiple tags and emit tags',
     inject([FiltersComponent, Event], (component, event) => {
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

  it('should remove and emit tags', inject([FiltersComponent, Event], (component, event) => {
       spyOn(component.tagsChange, 'next');
       component.tags = ['Marksman'];
       expect(component.tagsChange.next).not.toHaveBeenCalled();
       event.target = {checked: false, value: 'Marksman'};
       component.tagChanged(event);
       expect(component.tags).not.toContain('Marksman');
       expect(component.tagsChange.next).toHaveBeenCalled();
     }));

  it('should not emit sortChange on incorrect event',
     inject([FiltersComponent, Event], (component, event) => {
       spyOn(component.sortChange, 'next');
       expect(component.sortChange.next).not.toHaveBeenCalled();
       component.sortChanged(undefined);
       expect(component.sortChange.next).not.toHaveBeenCalled();
       event.target = undefined;
       component.sortChanged(event);
       expect(component.sortChange.next).not.toHaveBeenCalled();
     }));

  it('should update and emit sort', inject([FiltersComponent, Event], (component, event) => {
       spyOn(component.sortChange, 'next');
       expect(component.sortChange.next).not.toHaveBeenCalled();
       event.target = {value: 'attack'};
       component.sortChanged(event);
       expect(component.sort).toBe('attack');
       expect(component.sortChange.next).toHaveBeenCalled();
     }));
});
