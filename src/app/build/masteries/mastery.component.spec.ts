import {provide} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, beforeEachProviders} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';

import {LolApiService} from '../../misc/lolapi.service';
import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent, Colors} from './mastery.component';

class MockMasteryTierComponent extends MasteryTierComponent {
  public rank = 1;
  getRank() { return this.rank; }
  constructor(category: MasteryCategoryComponent) {
    super(category);
  }
}

describe('MasteryComponent', () => {
  beforeEachProviders(() => [
    provide(RouteParams, { useValue: new RouteParams({ region: 'euw' }) }),
    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: function(backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),

    LolApiService,
    MasteriesComponent,
    MasteryCategoryComponent,
    provide(MasteryTierComponent, {
      useFactory: function(category) {
        return new MockMasteryTierComponent(category);
      },
      deps: [MasteryCategoryComponent]
    }),
    MasteryComponent
  ]);


  it('should be initialised', inject([MasteryComponent], (component) => {
    expect(component.rank).toBe(0);
    expect(component.color).toBe(Colors.gray);
    expect(component.enabled).toBeFalsy();
    expect(component.active).toBeFalsy();
    expect(component.locked).toBeFalsy();
  }));

  it('should add mastery to tier', inject([MasteryComponent], (component) => {
    spyOn(component.tier, 'addMastery');
    expect(component.tier.addMastery).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.tier.addMastery).toHaveBeenCalled();
  }));


  it('should enable', inject([MasteryComponent], (component) => {
    spyOn(component, 'changed');
    component.enabled = false;
    component.data = true;
    expect(component.changed).not.toHaveBeenCalled();
    component.enable();
    expect(component.enabled).toBeTruthy();
    expect(component.changed).toHaveBeenCalled();
  }));

  it('should not enable when enabled', inject([MasteryComponent], (component) => {
    spyOn(component, 'changed');
    component.enabled = true;
    component.data = true;
    expect(component.changed).not.toHaveBeenCalled();
    component.enable();
    expect(component.enabled).toBeTruthy();
    expect(component.changed).not.toHaveBeenCalled();
  }));

  it('should disable when there is no data', inject([MasteryComponent], (component) => {
    spyOn(component, 'disable');
    expect(component.disable).not.toHaveBeenCalled();
    component.enabled = false;
    component.data = null;
    component.enable();
    expect(component.disable).toHaveBeenCalled();
  }));


  it('should disable', inject([MasteryComponent], (component) => {
    spyOn(component, 'changed');
    component.enabled = true;
    expect(component.changed).not.toHaveBeenCalled();
    component.disable();
    expect(component.enabled).toBeFalsy();
    expect(component.changed).toHaveBeenCalled();
  }));

  it('should not disable when disabled', inject([MasteryComponent], (component) => {
    spyOn(component, 'changed');
    component.enabled = false;
    expect(component.changed).not.toHaveBeenCalled();
    component.disable();
    expect(component.enabled).toBeFalsy();
    expect(component.changed).not.toHaveBeenCalled();
  }));

  it('should not disable when it has a rank', inject([MasteryComponent], (component) => {
    spyOn(component, 'changed');
    component.rank = 1;
    component.enabled = false;
    expect(component.changed).not.toHaveBeenCalled();
    component.disable();
    expect(component.rank).toBe(1);
    expect(component.enabled).toBeFalsy();
    expect(component.changed).not.toHaveBeenCalled();
  }));


  it('should lock', inject([MasteryComponent], (component) => {
    component.locked = false;
    component.lock();
    expect(component.locked).toBeTruthy();
  }));


  it('should unlock', inject([MasteryComponent], (component) => {
    component.locked = true;
    component.unlock();
    expect(component.locked).toBeFalsy();
  }));


  it('should get rank', inject([MasteryComponent], (component) => {
    component.rank = 5;
    expect(component.getRank()).toBe(5);
  }));


  it('should set rank', inject([MasteryComponent], (component) => {
    spyOn(component, 'changed');
    expect(component.changed).not.toHaveBeenCalled();
    component.rank = 3;
    component.enabled = true;
    component.setRank(5);
    expect(component.rank).toBe(5);
    expect(component.changed).toHaveBeenCalled();
  }));

  it('should not set rank when disabled', inject([MasteryComponent], (component) => {
    spyOn(component, 'changed');
    expect(component.changed).not.toHaveBeenCalled();
    component.rank = 3;
    component.enabled = false;
    component.setRank(5);
    expect(component.rank).toBe(3);
    expect(component.changed).not.toHaveBeenCalled();
  }));


  it('should get max rank', inject([MasteryComponent], (component) => {
    component.data = { ranks: 5 };
    expect(component.getMaxRank()).toBe(5);
  }));

  it('should get max rank zero when there is no data', inject([MasteryComponent], (component) => {
    component.data = null;
    expect(component.getMaxRank()).toBe(0);
    component.data = { ranks: null };
    expect(component.getMaxRank()).toBe(0);
  }));


  it('should add rank', inject([MasteryComponent], (component) => {
    component.rank = 1;
    component.data = { ranks: 5 };
    component.enabled = true;
    component.clicked();
    component.dragEnd();
    expect(component.rank).toBe(3);
  }));

  it('should add a tier rank when a rank is added', inject([MasteryComponent], (component) => {
    spyOn(component.tier, 'rankAdded');
    expect(component.tier.rankAdded).not.toHaveBeenCalled();
    component.enabled = true;
    component.addRank();
    expect(component.tier.rankAdded).toHaveBeenCalled();
  }));

  it('should add max rank when tier rank is zero', inject([MasteryComponent], (component) => {
    component.tier.rank = 0;
    component.data = { ranks: 5 };
    component.enabled = true;
    component.addRank();
    expect(component.rank).toBe(5);
  }));

  it('should not go above max rank', inject([MasteryComponent], (component) => {
    component.rank = 5;
    component.data = { ranks: 5 };
    component.enabled = true;
    component.addRank();
    expect(component.rank).toBe(5);
  }));

  it('should not add a rank when disabled', inject([MasteryComponent], (component) => {
    component.rank = 0;
    component.data = { ranks: 5 };
    component.enabled = false;
    component.addRank();
    expect(component.rank).toBe(0);
  }));

  it('should call changed when rank is changed', inject([MasteryComponent], (component) => {
    spyOn(component, 'changed');
    expect(component.changed).not.toHaveBeenCalled();
    component.rank = 0;
    component.data = { ranks: 5 };
    component.enabled = true;
    component.addRank();
    expect(component.changed).toHaveBeenCalled();
  }));


  it('should remove rank', inject([MasteryComponent], (component) => {
    component.rank = 2;
    component.enabled = true;
    component.rightClicked();
    expect(component.rank).toBe(1);
  }));

  it('should not remove rank when rank is zero', inject([MasteryComponent], (component) => {
    component.rank = 0;
    component.enabled = true;
    component.rightClicked();
    expect(component.rank).toBe(0);
  }));

  it('should not remove rank when disabled', inject([MasteryComponent], (component) => {
    component.rank = 2;
    component.enabled = false;
    component.removeRank();
    expect(component.rank).toBe(2);
  }));

  it('should not remove rank when locked', inject([MasteryComponent], (component) => {
    component.rank = 2;
    component.enabled = true;
    component.locked = true;
    component.removeRank();
    expect(component.rank).toBe(2);
  }));


  it('should set active and color when enabled', inject([MasteryComponent], (component) => {
    component.enabled = true;
    component.rank = 1;
    component.changed();
    expect(component.active).toBeTruthy();
    expect(component.color).toBe(Colors.yellow);
    component.rank = 0;
    component.changed();
    expect(component.active).toBeFalsy();
    expect(component.color).toBe(Colors.blue);
  }));


  it('should set active and color when disabled', inject([MasteryComponent], (component) => {
    component.enabled = false;
    component.changed();
    expect(component.active).toBeFalsy();
    expect(component.color).toBe(Colors.gray);
  }));
});
