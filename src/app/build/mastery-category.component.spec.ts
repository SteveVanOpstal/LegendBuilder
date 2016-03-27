import {provide, Inject, forwardRef} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, beforeEach, beforeEachProviders} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';

import {LolApiService} from '../misc/lolapi.service';
import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';

class MockMasteryTierComponent extends MasteryTierComponent {
  public index = 0;
  public rank: number = 0;
  public enabled: boolean = false;

  constructor( @Inject(forwardRef(() => MasteryCategoryComponent)) private category: MasteryCategoryComponent, index: number) {
    super(category);
    this.index = index;
  }

  getRank(): number { return this.rank; }
  enable() { this.enabled = true; }
  disable() { this.enabled = false; }
}

describe('MasteryCategoryComponent', () => {
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
    MasteryCategoryComponent
  ]);

  beforeEach(inject([MasteryCategoryComponent], (component) => {
    component.tiers = [
      new MockMasteryTierComponent(component, 0),
      new MockMasteryTierComponent(component, 1),
      new MockMasteryTierComponent(component, 2),
      new MockMasteryTierComponent(component, 3)];
  }));


  it('should be initialised', inject([MasteryCategoryComponent], (component) => {
    expect(component.data).not.toBeDefined();
    expect(component.totalRank).toBe(0);
  }));

  it('should add category to masteries', inject([MasteryCategoryComponent], (component) => {
    spyOn(component.masteries, 'addCategory');
    expect(component.masteries.addCategory).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.masteries.addCategory).toHaveBeenCalled();
  }));


  it('should enable tier zero', inject([MasteryCategoryComponent], (component) => {
    component.enable();
    expect(component.tiers[0].enabled).toBeTruthy();
  }));

  it('should enable tiers with ranks', inject([MasteryCategoryComponent], (component) => {
    component.tiers[1].rank = 1;
    component.tiers[3].rank = 5;
    component.enable();
    expect(component.tiers[0].enabled).toBeTruthy();
    expect(component.tiers[1].enabled).toBeFalsy();
    expect(component.tiers[2].enabled).toBeTruthy();
    expect(component.tiers[3].enabled).toBeFalsy();
  }));

  it('should disable tiers without ranks', inject([MasteryCategoryComponent], (component) => {
    for (let index in component.tiers) {
      component.tiers[index].enabled = true;
    }
    component.tiers[0].rank = 1;
    component.tiers[2].rank = 5;
    component.disable();
    expect(component.tiers[0].enabled).toBeTruthy();
    expect(component.tiers[1].enabled).toBeFalsy();
    expect(component.tiers[2].enabled).toBeTruthy();
    expect(component.tiers[3].enabled).toBeFalsy();
  }));


  // TODO: add "addRank", "removeRank"


  it('should get rank', inject([MasteryCategoryComponent], (component) => {
    component.tiers[0].rank = 1;
    component.tiers[2].rank = 5;
    expect(component.getRank()).toBe(6);
  }));

  it('should get total rank deviation', inject([MasteryCategoryComponent], (component) => {
    component.tiers[0].rank = 10;
    component.tiers[2].rank = 25;
    component.masteries.addCategory(component);
    expect(component.getTotalRankDeviation()).toBe(5);
    component.tiers[2].rank = 20;
    expect(component.getTotalRankDeviation()).toBe(0);
  }));
});
