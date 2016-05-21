import {provide} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {RouteSegment} from '@angular/router';

import {it, inject, beforeEachProviders} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {LolApiService} from '../../misc/lolapi.service';
import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

import {MockRouteSegment} from '../../testing';

describe('MasteryTierComponent', () => {
  beforeEachProviders(() => [
    provide(RouteSegment, { useValue: new MockRouteSegment({ region: 'euw' })}),

    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: (backend, defaultOptions) => {
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
    spyOn(component.category, 'addTierComponent');
    expect(component.category.addTierComponent).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.category.addTierComponent).toHaveBeenCalled();
  }));


  it('should add a mastery', inject([MasteryTierComponent], (component) => {
    let mastery = new MasteryComponent(component);
    component.addMasteryComponent(mastery);
    expect(component.masteryComponents[0]).toBeDefined();
    expect(component.masteryComponents[0].enabled).toBeTruthy();
  }));


  it('should enable', inject([MasteryTierComponent], (component) => {
    component.enable();
    for (let index in component.masteryComponents) {
      let mastery = component.masteryComponents[index];
      expect(mastery.enabled).toBeTruthy();
    }
  }));

  it('should disable', inject([MasteryTierComponent], (component) => {
    component.disable();
    for (let index in component.masteryComponents) {
      let mastery = component.masteryComponents[index];
      expect(mastery.enabled).toBeFalsy();
    }
  }));

  it('should lock', inject([MasteryTierComponent], (component) => {
    component.lock();
    for (let index in component.masteryComponents) {
      let mastery = component.masteryComponents[index];
      expect(mastery.locked).toBeTruthy();
    }
  }));

  it('should unlock', inject([MasteryTierComponent], (component) => {
    component.unlock();
    for (let index in component.masteryComponents) {
      let mastery = component.masteryComponents[index];
      expect(mastery.locked).toBeFalsy();
    }
  }));


  it('should get rank', inject([MasteryTierComponent], (component) => {
    let masteryComponent1 = new MasteryComponent(component);
    masteryComponent1.rank = 2;
    let masteryComponent2 = new MasteryComponent(component);
    masteryComponent2.rank = 1;
    component.masteryComponents = [masteryComponent1, masteryComponent2];
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
