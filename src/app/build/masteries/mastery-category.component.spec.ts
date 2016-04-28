import {provide, Inject, forwardRef} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, beforeEach, beforeEachProviders} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';

import {LolApiService} from '../../misc/lolapi.service';
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
    this.masteryComponents = [
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
      useFactory: (backend, defaultOptions) => {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),

    LolApiService,
    MasteriesComponent,
    MasteryCategoryComponent
  ]);

  beforeEach(inject([MasteryCategoryComponent], (component) => {
    component.tierComponents = [
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
    spyOn(component.masteries, 'addCategoryComponent');
    expect(component.masteries.addCategoryComponent).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.masteries.addCategoryComponent).toHaveBeenCalled();
  }));


  it('should add a tier', inject([MasteryCategoryComponent], (component) => {
    let tier = new MockMasteryTierComponent(component, 4);
    component.addTierComponent(tier);
    expect(component.tierComponents[4]).toBeDefined();
  }));


  it('should enable tier zero', inject([MasteryCategoryComponent], (component) => {
    component.enable();
    expect(component.tierComponents[0].masteryComponents[0].enabled).toBeTruthy();
  }));

  it('should enable tiers', inject([MasteryCategoryComponent], (component) => {
    component.tierComponents[1].masteryComponents[0].rank = 1;
    component.tierComponents[3].masteryComponents[0].rank = 5;
    component.tierComponents[0].masteryComponents[0].enabled = false;
    component.tierComponents[1].masteryComponents[0].enabled = false;
    component.tierComponents[2].masteryComponents[0].enabled = false;
    component.tierComponents[3].masteryComponents[0].enabled = false;
    component.enable();
    expect(component.tierComponents[0].masteryComponents[0].enabled).toBeTruthy();
    expect(component.tierComponents[1].masteryComponents[0].enabled).toBeFalsy();
    expect(component.tierComponents[2].masteryComponents[0].enabled).toBeTruthy();
    expect(component.tierComponents[3].masteryComponents[0].enabled).toBeFalsy();
  }));

  it('should disable tiers without ranks', inject([MasteryCategoryComponent], (component) => {
    for (let index in component.tierComponents) {
      component.tierComponents[index].masteryComponents[0].enabled = true;
    }
    component.tierComponents[0].masteryComponents[0].rank = 1;
    component.tierComponents[2].masteryComponents[0].rank = 5;
    component.disable();
    expect(component.tierComponents[0].masteryComponents[0].enabled).toBeTruthy();
    expect(component.tierComponents[1].masteryComponents[0].enabled).toBeFalsy();
    expect(component.tierComponents[2].masteryComponents[0].enabled).toBeTruthy();
    expect(component.tierComponents[3].masteryComponents[0].enabled).toBeFalsy();
  }));


  it('should enable/lock tiers', inject([MasteryCategoryComponent], (component) => {
    component.tierComponents[1].masteryComponents[0].rank = 5;
    component.tierComponents[1].masteryComponents[0].maxRank = 5;
    component.tierComponents[2].masteryComponents[0].enabled = false;
    component.tierComponents[0].masteryComponents[0].locked = false;
    component.rankAdded(component.tierComponents[1], component.tierComponents[1].masteryComponents[0]);
    expect(component.tierComponents[2].masteryComponents[0].enabled).toBeTruthy();
    expect(component.tierComponents[0].masteryComponents[0].locked).toBeTruthy();
  }));

  it('should lower the other rank in the tier', inject([MasteryCategoryComponent], (component) => {
    component.tierComponents[0].masteryComponents[0].maxRank = 5;
    component.tierComponents[0].masteryComponents[0].rank = 5;
    component.tierComponents[0].masteryComponents[1].rank = 1;
    component.rankAdded(component.tierComponents[0], component.tierComponents[0].masteryComponents[0]);
    expect(component.tierComponents[0].masteryComponents[1].rank).toBe(0);
  }));

  it('should not go over rank 30 (mastery)', inject([MasteryCategoryComponent], (component) => {
    component.tierComponents[0].masteryComponents[0].rank = 25;
    component.tierComponents[0].masteryComponents[1].rank = 4;
    component.tierComponents[1].masteryComponents[0].maxRank = 5;
    component.tierComponents[1].masteryComponents[0].rank = 2;
    component.masteries.addCategoryComponent(component);
    component.rankAdded(component.tierComponents[1], component.tierComponents[1].masteryComponents[0]);
    expect(component.tierComponents[1].masteryComponents[0].rank).toBe(1);
    expect(component.totalRank).toBe(30);
  }));

  it('should not go over rank 30 (tier)', inject([MasteryCategoryComponent], (component) => {
    component.tierComponents[0].masteryComponents[0].rank = 27;
    component.tierComponents[1].masteryComponents[0].maxRank = 5;
    component.tierComponents[1].masteryComponents[0].rank = 2;
    component.tierComponents[1].masteryComponents[1].rank = 2;
    component.masteries.addCategoryComponent(component);
    component.rankAdded(component.tierComponents[1], component.tierComponents[1].masteryComponents[0]);
    expect(component.tierComponents[1].masteryComponents[0].rank).toBe(2);
    expect(component.tierComponents[1].masteryComponents[1].rank).toBe(1);
    expect(component.totalRank).toBe(30);
  }));

  it('should should trigger masteries rankAdded event', inject([MasteryCategoryComponent], (component) => {
    spyOn(component.masteries, 'rankAdded');
    component.tierComponents[0].masteryComponents[0].rank = 1;
    component.rankAdded(component.tierComponents[0], component.tierComponents[0].masteryComponents[0]);
    expect(component.masteries.rankAdded).toHaveBeenCalled();
    expect(component.totalRank).toBe(1);
  }));


  it('should disable/unlock tiers', inject([MasteryCategoryComponent], (component) => {
    component.tierComponents[1].masteryComponents[0].rank = 2;
    component.tierComponents[1].masteryComponents[0].maxRank = 5;
    component.rankRemoved(component.tierComponents[1], component.tierComponents[1].masteryComponents[0]);
    expect(component.tierComponents[2].masteryComponents[0].enabled).toBeFalsy();
    expect(component.tierComponents[0].masteryComponents[0].locked).toBeFalsy();
  }));

  it('should should trigger masteries rankRemoved event', inject([MasteryCategoryComponent], (component) => {
    spyOn(component.masteries, 'rankRemoved');
    component.tierComponents[0].masteryComponents[0].rank = 1;
    component.tierComponents[1].masteryComponents[0].rank = 1;
    component.tierComponents[0].masteryComponents[0].maxRank = 5;
    component.rankRemoved(component.tierComponents[0], component.tierComponents[0].masteryComponents[0]);
    expect(component.masteries.rankRemoved).toHaveBeenCalled();
    expect(component.totalRank).toBe(2);
  }));


  it('should do nothing when tier or mastery is incorrect', inject([MasteryCategoryComponent], (component) => {
    component.tierComponents[0].masteryComponents[0].rank = 1;

    spyOn(component.masteries, 'rankRemoved');
    component.rankRemoved(null, component.tierComponents[0].masteryComponents[0]);
    expect(component.masteries.rankRemoved).not.toHaveBeenCalled();
    component.rankRemoved(component.tierComponents[0], null);
    expect(component.masteries.rankRemoved).not.toHaveBeenCalled();

    spyOn(component.masteries, 'rankAdded');
    component.rankAdded(null, component.tierComponents[0].masteryComponents[0]);
    expect(component.masteries.rankAdded).not.toHaveBeenCalled();
    component.rankAdded(component.tierComponents[0], null);
    expect(component.masteries.rankAdded).not.toHaveBeenCalled();
  }));


  it('should get rank', inject([MasteryCategoryComponent], (component) => {
    component.tierComponents[0].masteryComponents[0].rank = 1;
    component.tierComponents[2].masteryComponents[0].rank = 5;
    expect(component.getRank()).toBe(6);
  }));

  it('should get total rank deviation', inject([MasteryCategoryComponent], (component) => {
    component.tierComponents[0].masteryComponents[0].rank = 10;
    component.tierComponents[2].masteryComponents[0].rank = 25;
    component.masteries.addCategoryComponent(component);
    expect(component.getTotalRankDeviation()).toBe(5);
    component.tierComponents[2].masteryComponents[0].rank = 20;
    expect(component.getTotalRankDeviation()).toBe(0);
  }));
});
