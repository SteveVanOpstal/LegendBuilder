import {provide, Inject, forwardRef, QueryList} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {RouteSegment} from '@angular/router';

import {it, inject, async, beforeEach, beforeEachProviders} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';

import {LolApiService} from '../../misc/lolapi.service';
import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';

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

const data = {
  name: 'Ferocity',
  tiers: [
    [
      {
        id: 0,
        description: ['test6121'],
        image: { full: '6121.png' },
        ranks: 5
      },
      null,
      {
        id: 1,
        description: ['test6122'],
        image: { full: '6122.png' },
        ranks: 5
      }
    ],
    [
      {
        id: 0,
        description: ['test6121'],
        image: { full: '6121.png' },
        ranks: 5
      },
      {
        id: 1,
        description: ['test6122'],
        image: { full: '6122.png' },
        ranks: 5
      },
      {
        id: 1,
        description: ['test6122'],
        image: { full: '6122.png' },
        ranks: 5
      }
    ]
  ]
};

describe('MasteryCategoryComponent', () => {
  beforeEachProviders(() => [
    provide(RouteSegment, { useValue: new MockRouteSegment({ region: 'euw' }) }),

    MockBackend,
    BaseRequestOptions,
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


  let component: MasteryCategoryComponent;
  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.createAsync(MasteryCategoryComponent).then((fixture: ComponentFixture<MasteryCategoryComponent>) => {
      component = fixture.componentInstance;
      component.data = data;
      fixture.detectChanges();
    });
  })));


  it('should enable next tier when previous tier has a rank more than zero', () => {
    let tier1 = component.children.toArray()[0];
    let tier2 = component.children.toArray()[1];
    let mastery1 = tier1.children.toArray()[0];
    let mastery2 = tier2.children.toArray()[0];
    mastery1.setRank(5);
    mastery2.enabled = false;
    component.enable();
    expect(mastery2.enabled).toBeTruthy();
  });


  it('should lock previous tier when the tier is at max rank', () => {
    let tier1 = component.children.toArray()[0];
    let mastery1 = tier1.children.toArray()[0];
    spyOn(mastery1, 'lock');
    expect(mastery1.lock).not.toHaveBeenCalled();
    mastery1.unlock();
    let tier2 = component.children.toArray()[1];
    let mastery2 = tier2.children.toArray()[0];
    mastery2.enabled = true;
    mastery2.setRank(5);

    component.rankAdd({ tier: tier2, mastery: mastery2 });
    expect(mastery1.lock).toHaveBeenCalled();
  });
  it('should enable next tier when the tier is at max rank', () => {
    let tier1 = component.children.toArray()[0];
    let mastery1 = tier1.children.toArray()[0];
    mastery1.setRank(5);
    let tier2 = component.children.toArray()[1];
    let mastery2 = tier2.children.toArray()[0];
    mastery2.enabled = false;

    component.rankAdd({ tier: tier1, mastery: mastery1 });
    expect(mastery2.enabled).toBeTruthy();
  });


  it('should unlock previous tier when the tier is below max rank', () => {
    let tier1 = component.children.toArray()[0];
    let mastery1 = tier1.children.toArray()[0];
    spyOn(mastery1, 'unlock');
    expect(mastery1.unlock).not.toHaveBeenCalled();
    mastery1.lock();
    let tier2 = component.children.toArray()[1];
    let mastery2 = tier2.children.toArray()[0];
    mastery2.setRank(4);

    component.rankRemove({ tier: tier2, mastery: mastery2 });
    expect(mastery1.unlock).toHaveBeenCalled();
  });
  it('should disable next tier when the tier is below max rank', () => {
    let tier1 = component.children.toArray()[0];
    let mastery1 = tier1.children.toArray()[0];
    mastery1.setRank(4);
    let tier2 = component.children.toArray()[1];
    let mastery2 = tier2.children.toArray()[0];
    mastery2.enabled = true;

    component.rankRemove({ tier: tier1, mastery: mastery1 });
    expect(mastery2.enabled).toBeFalsy();
  });


  it('should lower the other rank in the tier', () => {
    let tier = component.children.toArray()[0];
    let mastery1 = tier.children.toArray()[0];
    let mastery2 = tier.children.toArray()[1];
    mastery1.setRank(5);
    mastery2.setRank(1);
    component.rankAdd({ tier: tier, mastery: mastery1 });
    expect(mastery2.getRank()).toBe(0);
  });
});
