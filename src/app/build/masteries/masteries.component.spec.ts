import {provide} from 'angular2/core';
import {BaseRequestOptions, Http, Response, ResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, injectAsync, beforeEach, beforeEachProviders} from 'angular2/testing';
import {MockBackend, MockConnection} from 'angular2/http/testing';

import {LolApiService} from '../../misc/lolapi.service';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteriesComponent} from './masteries.component';

class MockMasteryCategoryComponent extends MasteryCategoryComponent {
  public rank: number = 0;
  public enabled: boolean = false;
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
    MasteryCategoryComponent,
    MasteriesComponent
  ]);

  beforeEach(inject([MasteriesComponent], (component) => {
    component.categories = [
      new MockMasteryCategoryComponent(component),
      new MockMasteryCategoryComponent(component),
      new MockMasteryCategoryComponent(component),
      new MockMasteryCategoryComponent(component)
    ];
  }));


  it('should be initialised', inject([MasteriesComponent], (component) => {
    expect(component.data).not.toBeDefined();
    expect(component.loading).toBeFalsy;
    expect(component.error).toBeFalsy;
    expect(component.categories).toBeDefined();
  }));


  it('should enable', inject([MasteriesComponent], (component) => {
    component.enable();
    expect(component.categories[0].enabled).toBeTruthy();
  }));

  it('should disable', inject([MasteriesComponent], (component) => {
    component.categories[3].enabled = true;
    component.disable();
    expect(component.categories[3].enabled).toBeFalsy();
  }));

  it('should get rank', inject([MasteriesComponent], (component) => {
    component.categories[0].rank = 2;
    component.categories[1].rank = 2;
    expect(component.getRank()).toBe(4);
  }));

  it('should disable when rank is higher than 30', inject([MasteriesComponent], (component) => {
    spyOn(component, 'disable');
    expect(component.disable).not.toHaveBeenCalled();
    component.categories[0].rank = 30;
    component.rankAdded();
    expect(component.disable).toHaveBeenCalled();
  }));

  it('should enable when rank is 29', inject([MasteriesComponent], (component) => {
    spyOn(component, 'enable');
    expect(component.enable).not.toHaveBeenCalled();
    component.categories[0].rank = 29;
    component.rankRemoved();
    expect(component.enable).toHaveBeenCalled();
  }));


  it('should get masteries', injectAsync([MockBackend, MasteriesComponent, LolApiService], (mockBackend, component, service) => {
    spyOn(component, 'alterData');
    let mockResponse = new Response(new ResponseOptions({ status: 200, body: [{}] }));
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(mockResponse);
      });

    expect(component.alterData).not.toHaveBeenCalled();
    component.getData();
    return service.getMasteries().toPromise().then(() => {
      expect(component.alterData).toHaveBeenCalled();
    });
  }));

  it('should not get masteries', injectAsync([MockBackend, MasteriesComponent, LolApiService], (mockBackend, component, service) => {
    spyOn(component, 'alterData');
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockError();
      });

    expect(component.alterData).not.toHaveBeenCalled();
    component.getData();
    return service.getMasteries().toPromise().catch(() => {
      expect(component.alterData).not.toHaveBeenCalled();
    });
  }));


  it('should alter data', inject([MasteriesComponent], (component) => {
    let newMasteries = {
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
        },
        6122: {
          id: 1,
        }
      }
    };

    let alteredMasteries = [
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

    expect(component.alterData(newMasteries)).toHaveEqualContent(alteredMasteries);
  }));
});
