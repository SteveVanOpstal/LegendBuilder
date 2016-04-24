import {it, inject, beforeEach, beforeEachProviders} from 'angular2/testing';

import {ItemsFromComponent} from './items-from.component';

describe('ItemsFromComponent', () => {
  beforeEachProviders(() => [
    ItemsFromComponent
  ]);

  it('should be initialised', inject([ItemsFromComponent], (component) => {
    expect(component.items).not.toBeDefined();
    expect(component.itemSelected).toBeDefined();
    expect(component.itemPicked).toBeDefined();
  }));

  it('should emit itemSelected event', inject([ItemsFromComponent], (component) => {
    spyOn(component.itemSelected, 'emit');
    expect(component.itemSelected.emit).not.toHaveBeenCalled();
    component.selectItem({});
    expect(component.itemSelected.emit).toHaveBeenCalled();
  }));

  it('should emit itemPicked event', inject([ItemsFromComponent], (component) => {
    spyOn(component.itemPicked, 'emit');
    expect(component.itemPicked.emit).not.toHaveBeenCalled();
    let result = component.pickItem({});
    expect(result).toBeFalsy();
    expect(component.itemPicked.emit).toHaveBeenCalled();
  }));
});
