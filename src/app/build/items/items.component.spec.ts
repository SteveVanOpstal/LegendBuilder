//import {spyOn} from 'jasmine';
import {it, inject, beforeEachProviders, beforeEach} from 'angular2/testing';

import {ItemsComponent} from './items.component';

describe('ItemsComponent', () => {
  beforeEachProviders(() => [
    ItemsComponent
  ]);

  beforeEach(inject([ItemsComponent], (component) => {
    component.config = { g: [100, 200, 300], gameTime: 200, sampleSize: 20 };
    component.items = [
      {
        'id': 3341,
        'gold': { 'total': 0 }
      },
      {
        'id': 2003,
        'gold': { 'total': 50 }
      },
      {
        'id': 2003,
        'gold': { 'total': 50 }
      },
      {
        'id': 2003,
        'gold': { 'total': 50 }
      }
    ];
  }));

  it('should update on changes', inject([ItemsComponent], (component) => {
    spyOn(component, 'addTime');
    spyOn(component, 'addBundle');
    expect(component.addTime).not.toHaveBeenCalled();
    expect(component.addBundle).not.toHaveBeenCalled();
    component.ngDoCheck();
    expect(component.addTime).toHaveBeenCalled();
    expect(component.addBundle).toHaveBeenCalled();
  }));

  it('should calculate time', inject([ItemsComponent], (component) => {
    component.addTime();
    expect(component.items[0].time).toBe(0);
    expect(component.items[1].time).toBe(0);
    expect(component.items[2].time).toBe(0);
    expect(component.items[3].time).toBe(5);
  }));

  it('should not calculate time', inject([ItemsComponent], (component) => {
    component.items = [
      {
        'id': 123,
        'gold': { 'total': 400 }
      }
    ];
    component.addTime();
    component.addBundle();
    expect(component.items[0].time).toBe(-1);
  }));

  it('should bundle', inject([ItemsComponent], (component) => {
    component.addTime();
    component.addBundle();
    expect(component.items.length).toBe(3);
    expect(component.items[1].bundle).toBe(2);
  }));

  it('should not bundle', inject([ItemsComponent], (component) => {
    component.items = [];
    component.addBundle();
    expect(component.items).toHaveEqualContent([]);

    component.items = [{ id: 1, bundle: 1 }, { id: 2, bundle: 1 }];
    component.addBundle();
    expect(component.items[0].bundle).toBe(1);
  }));
});
