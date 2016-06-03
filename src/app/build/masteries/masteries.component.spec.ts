import {provide} from '@angular/core';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {RouteSegment} from '@angular/router';

import {it, inject, async, beforeEach, beforeEachProviders} from '@angular/core/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';

import {LolApiService} from '../../misc/lolapi.service';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteriesComponent} from './masteries.component';

import {MockRouteSegment} from '../../testing';

class MockMasteryCategoryComponent extends MasteryCategoryComponent {
  public rank: number = 0;
  public enabled: boolean = false;
  getRank(): number { return this.rank; }
  enable() { this.enabled = true; }
  disable() { this.enabled = false; }
}

const masteriesData = {
  tree: {
    Ferocity: [
      {
        masteryTreeItems: [
          {
            masteryId: 6121
          },
          null,
          {
            masteryId: 6122
          }
        ]
      },
      {
        masteryTreeItems: [
          {
            masteryId: 6121
          },
          {
            masteryId: 6122
          },
          {
            masteryId: 6122
          }
        ]
      }
    ],
    Cunning: [
      {
        masteryTreeItems: [
          {
            masteryId: 6121
          },
          null,
          {
            masteryId: 6122
          }
        ]
      }
    ],
    Resolve: [
      {
        masteryTreeItems: [
          {
            masteryId: 6121
          },
          null,
          {
            masteryId: 6122
          }
        ]
      }
    ]
  },
  data: {
    6121: {
      id: 0,
      description: ['Melee: Deal 3% additional damage, take 1.5% additional damage.<br><br>Ranged: Deal and take 2% additional damage'],
      image: { full: '6121.png' }
    },
    6122: {
      id: 1,
      description: ['Killing a unit restores 20 Health (30 second cooldown)'],
      image: { full: '6122.png' }
    }
  }
};

const masteriesDataAltered = [
  {
    name: 'Ferocity',
    tiers: [
      [
        { id: 0 },
        null,
        { id: 1 }
      ],
      [
        { id: 0 },
        { id: 1 },
        { id: 1 }
      ]
    ]
  },
  {
    name: 'Cunning',
    tiers: [
      [
        { id: 0 },
        null,
        { id: 1 }
      ]
    ]
  },
  {
    name: 'Resolve',
    tiers: [
      [
        { id: 0 },
        null,
        { id: 1 }
      ]
    ]
  }
];

describe('MasteriesComponent', () => {
  beforeEachProviders(() => [
    provide(RouteSegment, { useValue: new MockRouteSegment({ region: 'euw' }) }),

    BaseRequestOptions,
    provide(MockBackend, {
      useFactory: () => {
        let mockBackend = new MockBackend();
        let mockResponse = new Response(new ResponseOptions({ status: 200, body: masteriesData }));
        mockBackend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(mockResponse);
          }
        );
        return mockBackend;
      }
    }),
    provide(Http, {
      useFactory: (backend, defaultOptions) => {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),

    LolApiService,
    MasteryCategoryComponent,
    MasteriesComponent
  ]);

  let component: MasteriesComponent;
  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.createAsync(MasteriesComponent).then((fixture: ComponentFixture<MasteriesComponent>) => {
      fixture.detectChanges();
      component = fixture.componentInstance;
    });
  })));

  it('should be initialised', () => {
    expect(component.data).toBeDefined();
    expect(component.children).toBeDefined();
  });


  it('should enable', () => {
    component.enable();
    expect(component.children.toArray()[0].children.toArray()[1].children.toArray()[0].enabled).toBeFalsy();
  });
  it('should disable', () => {
    component.disable();
    expect(component.children.toArray()[1].children.toArray()[0].children.toArray()[0].enabled).toBeFalsy();
  });

  it('should get rank', () => {
    component.children.toArray()[0].children.toArray()[0].children.toArray()[0].setRank(2);
    component.children.toArray()[1].children.toArray()[0].children.toArray()[0].setRank(2);
    expect(component.getRank()).toBe(4);
  });

  it('should disable when rank is higher than 30', () => {
    spyOn(component, 'disable');
    expect(component.disable).not.toHaveBeenCalled();
    let tier = component.children.toArray()[0].children.toArray()[0];
    let mastery = tier.children.toArray()[0];
    mastery.setRank(30);
    component.rankAdd({ tier: tier, mastery: mastery });
    expect(component.disable).toHaveBeenCalled();
  });
  it('should enable when rank is 29', () => {
    spyOn(component, 'enable');
    expect(component.enable).not.toHaveBeenCalled();
    let tier = component.children.toArray()[0].children.toArray()[0];
    let mastery = tier.children.toArray()[0];
    mastery.setRank(29);
    component.rankRemove({ tier: tier, mastery: mastery });
    expect(component.enable).toHaveBeenCalled();
  });


  // it('should get masteries', inject([MockBackend, MasteriesComponent, LolApiService], (mockBackend, component, service) => {
  //   spyOn(component, 'alterData');
  //   let mockResponse = new Response(new ResponseOptions({ status: 200, body: [{}] }));
  //   mockBackend.connections.subscribe(
  //     (connection: MockConnection) => {
  //       connection.mockRespond(mockResponse);
  //     });

  //   expect(component.alterData).not.toHaveBeenCalled();
  //   component.getData();
  //   return service.getMasteries().toPromise().then(() => {
  //     expect(component.alterData).toHaveBeenCalled();
  //   });
  // }));

  // it('should not get masteries', inject([MockBackend, MasteriesComponent, LolApiService], (mockBackend, component, service) => {
  //   spyOn(component, 'alterData');
  //   mockBackend.connections.subscribe(
  //     (connection: MockConnection) => {
  //       connection.mockError();
  //     });

  //   expect(component.alterData).not.toHaveBeenCalled();
  //   component.getData();
  //   return service.getMasteries().toPromise().catch(() => {
  //     expect(component.alterData).not.toHaveBeenCalled();
  //   });
  // }));


  // it('should alter data', inject([MasteriesComponent], (component) => {
  //   expect(component.alterData(masteriesData)).toHaveEqualContent(masteriesDataAltered);
  // }));

  // it('should get total rank deviation', inject([MasteryCategoryComponent], (component) => {
  //   component.tierComponents[0].masteryComponents[0].rank = 10;
  //   component.tierComponents[2].masteryComponents[0].rank = 25;
  //   component.masteries.addCategoryComponent(component);
  //   expect(component.getTotalRankDeviation()).toBe(5);
  //   component.tierComponents[2].masteryComponents[0].rank = 20;
  //   expect(component.getTotalRankDeviation()).toBe(0);
  // }));
});
