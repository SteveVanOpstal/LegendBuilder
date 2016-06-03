import {provide, Inject, forwardRef, QueryList} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {RouteSegment} from '@angular/router';

import {it, inject, beforeEach, beforeEachProviders} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {LolApiService} from '../../misc/lolapi.service';
import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

import {MockRouteSegment} from '../../testing';

// class MockMasteryComponent extends MasteryComponent {
//   public rank: number = 0;
//   public maxRank: number = 0;

//   constructor() {
//     super();
//     super.enable();
//     super.unlock();
//     super.data = {};
//   }

//   getRank() { return this.rank; }
//   getMaxRank(): number { return this.maxRank; }
// }

// class MockMasteryTierComponent extends MasteryTierComponent {
//   public index = 0;

//   children: QueryList<MasteryComponent>;

//   constructor(index: number) {
//     super();
//     this.index = index;
//     this.children = [
//       new MockMasteryComponent(),
//       new MockMasteryComponent(),
//       new MockMasteryComponent(),
//       new MockMasteryComponent()
//     ];
//   }
// }

describe('MasteryCategoryComponent', () => {
  beforeEachProviders(() => [
    provide(RouteSegment, { useValue: new MockRouteSegment({ region: 'euw' }) }),

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

  // beforeEach(inject([MasteryCategoryComponent], (component) => {
  //   let masteryTierComponent1 = new MasteryTierComponent();
  //   let masteryComponent1 =  new MasteryTierComponent();
  //   masteryComponent1.enable();
  //   let masteryComponent2 =  new MasteryTierComponent();
  //   masteryTierComponent1.children = [
  //     masteryComponent1,
  //     masteryComponent2
  //   ];

  //   component.children = [];
  // }));


  // it('should be initialised', inject([MasteryCategoryComponent], (component) => {
  //   expect(component.data).not.toBeDefined();
  //   expect(component.totalRank).toBe(0);
  // }));


  // it('should enable tier zero', inject([MasteryCategoryComponent], (component) => {
  //   component.enable();
  //   expect(component.children[0].masteryComponents[0].enabled).toBeTruthy();
  // }));

  // it('should enable tiers', inject([MasteryCategoryComponent], (component) => {
  //   component.children[1].masteryComponents[0].rank = 1;
  //   component.children[3].masteryComponents[0].rank = 5;
  //   component.children[0].masteryComponents[0].enabled = false;
  //   component.children[1].masteryComponents[0].enabled = false;
  //   component.children[2].masteryComponents[0].enabled = false;
  //   component.children[3].masteryComponents[0].enabled = false;
  //   component.enable();
  //   expect(component.children[0].masteryComponents[0].enabled).toBeTruthy();
  //   expect(component.children[1].masteryComponents[0].enabled).toBeFalsy();
  //   expect(component.children[2].masteryComponents[0].enabled).toBeTruthy();
  //   expect(component.children[3].masteryComponents[0].enabled).toBeFalsy();
  // }));

  // it('should disable tiers without ranks', inject([MasteryCategoryComponent], (component) => {
  //   for (let index in component.children) {
  //     component.children[index].masteryComponents[0].enabled = true;
  //   }
  //   component.children[0].masteryComponents[0].rank = 1;
  //   component.children[2].masteryComponents[0].rank = 5;
  //   component.disable();
  //   expect(component.children[0].masteryComponents[0].enabled).toBeTruthy();
  //   expect(component.children[1].masteryComponents[0].enabled).toBeFalsy();
  //   expect(component.children[2].masteryComponents[0].enabled).toBeTruthy();
  //   expect(component.children[3].masteryComponents[0].enabled).toBeFalsy();
  // }));


  // it('should enable/lock tiers', inject([MasteryCategoryComponent], (component) => {
  //   component.children[1].masteryComponents[0].rank = 5;
  //   component.children[1].masteryComponents[0].maxRank = 5;
  //   component.children[2].masteryComponents[0].enabled = false;
  //   component.children[0].masteryComponents[0].locked = false;
  //   component.rankAdd(component.children[1], component.children[1].masteryComponents[0]);
  //   expect(component.children[2].masteryComponents[0].enabled).toBeTruthy();
  //   expect(component.children[0].masteryComponents[0].locked).toBeTruthy();
  // }));

  // it('should lower the other rank in the tier', inject([MasteryCategoryComponent], (component) => {
  //   component.children[0].masteryComponents[0].maxRank = 5;
  //   component.children[0].masteryComponents[0].rank = 5;
  //   component.children[0].masteryComponents[1].rank = 1;
  //   component.rankAdd(component.children[0], component.children[0].masteryComponents[0]);
  //   expect(component.children[0].masteryComponents[1].rank).toBe(0);
  // }));

  // it('should not go over rank 30 (mastery)', inject([MasteryCategoryComponent], (component) => {
  //   component.children[0].masteryComponents[0].rank = 25;
  //   component.children[0].masteryComponents[1].rank = 4;
  //   component.children[1].masteryComponents[0].maxRank = 5;
  //   component.children[1].masteryComponents[0].rank = 2;
  //   component.masteries.addCategoryComponent(component);
  //   component.rankAdd(component.children[1], component.children[1].masteryComponents[0]);
  //   expect(component.children[1].masteryComponents[0].rank).toBe(1);
  //   expect(component.totalRank).toBe(30);
  // }));

  // it('should not go over rank 30 (tier)', inject([MasteryCategoryComponent], (component) => {
  //   component.children[0].masteryComponents[0].rank = 27;
  //   component.children[1].masteryComponents[0].maxRank = 5;
  //   component.children[1].masteryComponents[0].rank = 2;
  //   component.children[1].masteryComponents[1].rank = 2;
  //   component.masteries.addCategoryComponent(component);
  //   component.rankAdd(component.children[1], component.children[1].masteryComponents[0]);
  //   expect(component.children[1].masteryComponents[0].rank).toBe(2);
  //   expect(component.children[1].masteryComponents[1].rank).toBe(1);
  //   expect(component.totalRank).toBe(30);
  // }));


  // it('should disable/unlock tiers', inject([MasteryCategoryComponent], (component) => {
  //   component.children[1].masteryComponents[0].rank = 2;
  //   component.children[1].masteryComponents[0].maxRank = 5;
  //   component.rankRemove(component.children[1], component.children[1].masteryComponents[0]);
  //   expect(component.children[2].masteryComponents[0].enabled).toBeFalsy();
  //   expect(component.children[0].masteryComponents[0].locked).toBeFalsy();
  // }));


  // it('should do nothing when tier or mastery is incorrect', inject([MasteryCategoryComponent], (component) => {
  //   component.children[0].masteryComponents[0].rank = 1;

  //   spyOn(component.rankRemoved, 'emit');
  //   component.rankRemove(undefined, component.children[0].masteryComponents[0]);
  //   expect(component.rankRemoved.emit).not.toHaveBeenCalled();
  //   component.rankRemove(component.children[0], undefined);
  //   expect(component.rankRemoved.emit).not.toHaveBeenCalled();

  //   spyOn(component.rankAdded, 'emit');
  //   component.rankAdd(undefined, component.children[0].masteryComponents[0]);
  //   expect(component.rankAdded.emit).not.toHaveBeenCalled();
  //   component.rankAdd(component.children[0], undefined);
  //   expect(component.rankAdded.emit).not.toHaveBeenCalled();
  // }));


  // it('should get rank', inject([MasteryCategoryComponent], (component) => {
  //   component.children[0].masteryComponents[0].rank = 1;
  //   component.children[2].masteryComponents[0].rank = 5;
  //   expect(component.getRank()).toBe(6);
  // }));

  // it('should should trigger masteries rankAdded event', inject([MasteryCategoryComponent], (component) => {
  //   spyOn(component.rankAdded, 'emit');
  //   expect(component.rankAdded.emit).not.toHaveBeenCalled();
  //   let tier = new MasteryTierComponent();
  //   let mastery = new MasteryTierComponent();
  //   component.rankAdd(tier, mastery);
  //   expect(component.rankAdded.emit).toHaveBeenCalled();
  // }));

  // it('should should trigger masteries rankRemoved event', inject([MasteryCategoryComponent], (component) => {
  //   spyOn(component.rankRemoved, 'emit');
  //   expect(component.rankRemoved.emit).not.toHaveBeenCalled();
  //   let tier = new MasteryTierComponent();
  //   let mastery = new MasteryTierComponent();
  //   component.rankRemove(tier, mastery);
  //   expect(component.rankRemoved.emit).toHaveBeenCalled();
  // }));
});
