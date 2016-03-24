import {provide} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import {RootRouter} from 'angular2/src/router/router';

import {it, inject, beforeEachProviders} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';

import {LolApiService} from '../misc/lolapi.service';
import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent, Colors} from './mastery.component';

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
    MasteryTierComponent,
    MasteryComponent
  ]);


  it('should add mastery to tier', inject([MasteryComponent], (component) => {
    spyOn(component.tier, 'addMastery');
    expect(component.tier.addMastery).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.tier.addMastery).toHaveBeenCalled();
  }));

  it('should be initialised', inject([MasteryComponent], (component) => {
    expect(component.data).not.toBeDefined();
    expect(component.rank).toBe(0);
    expect(component.color).toBe(Colors.gray);
    expect(component.disabled).toBeTruthy();
    expect(component.active).toBeFalsy();
    expect(component.locked).toBeFalsy();
  }));
});
