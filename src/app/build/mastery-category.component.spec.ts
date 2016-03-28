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
import {MasteryComponent} from './mastery.component';


class MockMasteryComponent extends MasteryComponent {
  public rank: number = 0;
  public maxRank: number = 0;

  constructor(category: MockMasteryTierComponent) {
    super(<MasteryTierComponent>category);
    super.enable();
    super.unlock();
    super.data = {};
  }

  getRank() { return this.rank; }
  getMaxRank(): number { return this.maxRank; }
}

class MockMasteryTierComponent extends MasteryTierComponent {
  public index = 0;

  constructor( @Inject(forwardRef(() => MasteryCategoryComponent)) private category: MasteryCategoryComponent, index: number) {
    super(category);
    this.index = index;
    this.masteries = [
      new MockMasteryComponent(this),
      new MockMasteryComponent(this),
      new MockMasteryComponent(this),
      new MockMasteryComponent(this)
    ];
  }
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
      new MockMasteryTierComponent(component, 3)
    ];
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
    expect(component.tiers[0].masteries[0].enabled).toBeTruthy();
  }));

  it('should enable tiers', inject([MasteryCategoryComponent], (component) => {
    component.tiers[1].masteries[0].rank = 1;
    component.tiers[3].masteries[0].rank = 5;
    component.tiers[0].masteries[0].enabled = false;
    component.tiers[1].masteries[0].enabled = false;
    component.tiers[2].masteries[0].enabled = false;
    component.tiers[3].masteries[0].enabled = false;
    component.enable();
    expect(component.tiers[0].masteries[0].enabled).toBeTruthy();
    expect(component.tiers[1].masteries[0].enabled).toBeFalsy();
    expect(component.tiers[2].masteries[0].enabled).toBeTruthy();
    expect(component.tiers[3].masteries[0].enabled).toBeFalsy();
  }));

  it('should disable tiers without ranks', inject([MasteryCategoryComponent], (component) => {
    for (let index in component.tiers) {
      component.tiers[index].masteries[0].enabled = true;
    }
    component.tiers[0].masteries[0].rank = 1;
    component.tiers[2].masteries[0].rank = 5;
    component.disable();
    expect(component.tiers[0].masteries[0].enabled).toBeTruthy();
    expect(component.tiers[1].masteries[0].enabled).toBeFalsy();
    expect(component.tiers[2].masteries[0].enabled).toBeTruthy();
    expect(component.tiers[3].masteries[0].enabled).toBeFalsy();
  }));


  it('should enable/lock tiers', inject([MasteryCategoryComponent], (component) => {
    component.tiers[1].masteries[0].rank = 5;
    component.tiers[1].masteries[0].maxRank = 5;
    component.tiers[2].masteries[0].enabled = false;
    component.tiers[0].masteries[0].locked = false;
    component.rankAdded(component.tiers[1], component.tiers[1].masteries[0]);
    expect(component.tiers[2].masteries[0].enabled).toBeTruthy();
    expect(component.tiers[0].masteries[0].locked).toBeTruthy();
  }));

  it('should lower the other rank in the tier', inject([MasteryCategoryComponent], (component) => {
    component.tiers[0].masteries[0].maxRank = 5;
    component.tiers[0].masteries[0].rank = 5;
    component.tiers[0].masteries[1].rank = 1;
    component.rankAdded(component.tiers[0], component.tiers[0].masteries[0]);
    expect(component.tiers[0].masteries[1].rank).toBe(0);
  }));

  it('should not go over rank 30 (mastery)', inject([MasteryCategoryComponent], (component) => {
    component.tiers[0].masteries[0].rank = 25;
    component.tiers[0].masteries[1].rank = 4;
    component.tiers[1].masteries[0].maxRank = 5;
    component.tiers[1].masteries[0].rank = 2;
    component.masteries.addCategory(component);
    component.rankAdded(component.tiers[1], component.tiers[1].masteries[0]);
    expect(component.tiers[1].masteries[0].rank).toBe(1);
    expect(component.totalRank).toBe(30);
  }));

  it('should not go over rank 30 (tier)', inject([MasteryCategoryComponent], (component) => {
    component.tiers[0].masteries[0].rank = 27;
    component.tiers[1].masteries[0].maxRank = 5;
    component.tiers[1].masteries[0].rank = 2;
    component.tiers[1].masteries[1].rank = 2;
    component.masteries.addCategory(component);
    console.log(component.getTotalRankDeviation());
    component.rankAdded(component.tiers[1], component.tiers[1].masteries[0]);
    expect(component.tiers[1].masteries[0].rank).toBe(2);
    expect(component.tiers[1].masteries[1].rank).toBe(1);
    expect(component.totalRank).toBe(30);
  }));

  it('should should trigger masteries rankAdded event', inject([MasteryCategoryComponent], (component) => {
    spyOn(component.masteries, 'rankAdded');
    component.tiers[0].masteries[0].rank = 1;
    component.rankAdded(component.tiers[0], component.tiers[0].masteries[0]);
    expect(component.masteries.rankAdded).toHaveBeenCalled();
    expect(component.totalRank).toBe(1);
  }));


  it('should disable/unlock tiers', inject([MasteryCategoryComponent], (component) => {
    component.tiers[1].masteries[0].rank = 2;
    component.tiers[1].masteries[0].maxRank = 5;
    component.rankRemoved(component.tiers[1], component.tiers[1].masteries[0]);
    expect(component.tiers[2].masteries[0].enabled).toBeFalsy();
    expect(component.tiers[0].masteries[0].locked).toBeFalsy();
  }));

  it('should should trigger masteries rankRemoved event', inject([MasteryCategoryComponent], (component) => {
    spyOn(component.masteries, 'rankRemoved');
    component.tiers[0].masteries[0].rank = 1;
    component.tiers[1].masteries[0].rank = 1;
    component.tiers[0].masteries[0].maxRank = 5;
    component.rankRemoved(component.tiers[0], component.tiers[0].masteries[0]);
    expect(component.masteries.rankRemoved).toHaveBeenCalled();
    expect(component.totalRank).toBe(2);
  }));


  it('should get rank', inject([MasteryCategoryComponent], (component) => {
    component.tiers[0].masteries[0].rank = 1;
    component.tiers[2].masteries[0].rank = 5;
    expect(component.getRank()).toBe(6);
  }));

  it('should get total rank deviation', inject([MasteryCategoryComponent], (component) => {
    component.tiers[0].masteries[0].rank = 10;
    component.tiers[2].masteries[0].rank = 25;
    component.masteries.addCategory(component);
    expect(component.getTotalRankDeviation()).toBe(5);
    component.tiers[2].masteries[0].rank = 20;
    expect(component.getTotalRankDeviation()).toBe(0);
  }));
});
