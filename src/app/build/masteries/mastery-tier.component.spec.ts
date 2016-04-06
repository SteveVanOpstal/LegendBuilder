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
import {MasteryComponent} from './mastery.component';

describe('MasteryTierComponent', () => {
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
    MasteryTierComponent
  ]);

  it('should be initialised', inject([MasteryTierComponent], (component) => {
    expect(component.data).not.toBeDefined();
    expect(component.index).toBe(0);
  }));

  it('should add tier to category', inject([MasteryTierComponent], (component) => {
    spyOn(component.category, 'addTier');
    expect(component.category.addTier).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.category.addTier).toHaveBeenCalled();
  }));


  it('should add a mastery', inject([MasteryTierComponent], (component) => {
    let mastery = new MasteryComponent(component);
    component.addMastery(mastery);
    expect(component.masteries[0]).toBeDefined();
    expect(component.masteries[0].enabled).toBeTruthy();
  }));


  it('should enable', inject([MasteryTierComponent], (component) => {
    component.enable();
    for (let mastery in component.masteries) {
      expect(mastery.enabled).toBeTruthy();
    }
  }));

  it('should disable', inject([MasteryTierComponent], (component) => {
    component.disable();
    for (let mastery in component.masteries) {
      expect(mastery.enabled).toBeFalsy();
    }
  }));

  it('should lock', inject([MasteryTierComponent], (component) => {
    component.lock();
    for (let mastery in component.masteries) {
      expect(mastery.locked).toBeTruthy();
    }
  }));

  it('should unlock', inject([MasteryTierComponent], (component) => {
    component.unlock();
    for (let mastery in component.masteries) {
      expect(mastery.locked).toBeFalsy();
    }
  }));


  it('should get rank', inject([MasteryTierComponent], (component) => {
    let masteryComponent1 = new MasteryComponent(component);
    masteryComponent1.rank = 2;
    let masteryComponent2 = new MasteryComponent(component);
    masteryComponent2.rank = 1;
    component.masteries = [masteryComponent1, masteryComponent2];
    expect(component.getRank()).toBe(3);
  }));


  it('should trigger category rankAdded event', inject([MasteryTierComponent], (component) => {
    spyOn(component.category, 'rankAdded');
    component.rankAdded();
    expect(component.category.rankAdded).toHaveBeenCalled();
  }));

  it('should trigger category rankRemoved event', inject([MasteryTierComponent], (component) => {
    spyOn(component.category, 'rankRemoved');
    component.rankRemoved();
    expect(component.category.rankRemoved).toHaveBeenCalled();
  }));
});
