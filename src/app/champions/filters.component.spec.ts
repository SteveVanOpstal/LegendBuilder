import {provide} from 'angular2/core';

import {it, inject, beforeEachProviders} from 'angular2/testing';

import {FiltersComponent} from './filters.component';

class MockEvent {
  public target: any;
}
class MockKeyboardEvent {
  public key: any;
}

describe('FiltersComponent', () => {
  beforeEachProviders(() => [
    provide(Event, { useValue: new MockEvent() }),
    provide(KeyboardEvent, { useValue: new MockKeyboardEvent() }),
    FiltersComponent
  ]);

  it('should not emit tagsChange on incorrect event', inject([FiltersComponent, Event], (component, event) => {
    spyOn(component.tagsChange, 'next');
    expect(component.tagsChange.next).not.toHaveBeenCalled();
    component.tagChanged(null);
    expect(component.tagsChange.next).not.toHaveBeenCalled();
    event.target = null;
    component.tagChanged(event);
    expect(component.tagsChange.next).not.toHaveBeenCalled();
  }));

  it('should add and emit tags', inject([FiltersComponent, Event], (component, event) => {
    spyOn(component.tagsChange, 'next');
    expect(component.tags).not.toContain('Marksman');
    expect(component.tagsChange.next).not.toHaveBeenCalled();
    event.target = { checked: true, value: 'Marksman' };
    component.tagChanged(event);
    expect(component.tags).toContain('Marksman');
    expect(component.tagsChange.next).toHaveBeenCalled();
  }));

  it('should add multiple tags and emit tags', inject([FiltersComponent, Event], (component, event) => {
    spyOn(component.tagsChange, 'next');
    expect(component.tags).not.toContain('Marksman');
    expect(component.tagsChange.next).not.toHaveBeenCalled();
    event.target = { checked: true, value: 'Marksman' };
    component.tagChanged(event);
    expect(component.tags).toContain('Marksman');
    expect(component.tags).not.toContain('Assassin');
    expect(component.tagsChange.next).toHaveBeenCalled();
    event.target = { checked: true, value: 'Assassin' };
    component.tagChanged(event);
    expect(component.tags).toContain('Marksman');
    expect(component.tags).toContain('Assassin');
    expect(component.tagsChange.next).toHaveBeenCalled();
  }));

  it('should remove and emit tags', inject([FiltersComponent, Event], (component, event) => {
    spyOn(component.tagsChange, 'next');
    component.tags = ['Marksman'];
    expect(component.tagsChange.next).not.toHaveBeenCalled();
    event.target = { checked: false, value: 'Marksman' };
    component.tagChanged(event);
    expect(component.tags).not.toContain('Marksman');
    expect(component.tagsChange.next).toHaveBeenCalled();
  }));


  it('should not emit sortChange on incorrect event', inject([FiltersComponent, Event], (component, event) => {
    spyOn(component.sortChange, 'next');
    expect(component.sortChange.next).not.toHaveBeenCalled();
    component.sortChanged(null);
    expect(component.sortChange.next).not.toHaveBeenCalled();
    event.target = null;
    component.sortChanged(event);
    expect(component.sortChange.next).not.toHaveBeenCalled();
  }));

  it('should update and emit sort', inject([FiltersComponent, Event], (component, event) => {
    spyOn(component.sortChange, 'next');
    expect(component.sortChange.next).not.toHaveBeenCalled();
    event.target = { value: 'attack' };
    component.sortChanged(event);
    expect(component.sort).toBe('attack');
    expect(component.sortChange.next).toHaveBeenCalled();
  }));

  it('should not emit enterHit on incorrect event', inject([FiltersComponent, KeyboardEvent], (component, event) => {
    spyOn(component.enterHit, 'next');
    expect(component.enterHit.next).not.toHaveBeenCalled();
    component.keyup(null);
    expect(component.enterHit.next).not.toHaveBeenCalled();
    event.key = null;
    component.keyup(event);
    expect(component.enterHit.next).not.toHaveBeenCalled();
    event.key = 'Escape';
    component.keyup(event);
    expect(component.enterHit.next).not.toHaveBeenCalled();
  }));

  it('should emit enterHit', inject([FiltersComponent, KeyboardEvent], (component, event) => {
    spyOn(component.enterHit, 'next');
    expect(component.enterHit.next).not.toHaveBeenCalled();
    event.key = 'Enter';
    component.keyup(event);
    expect(component.enterHit.next).toHaveBeenCalled();
  }));
});
