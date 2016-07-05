import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {provide} from '@angular/core';
import {async, beforeEach, beforeEachProviders, inject, it} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute} from '@angular/router';

import {LolApiService} from '../../misc/lolapi.service';
import {MockActivatedRoute} from '../../testing';

import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

const data = [
  {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5}, null,
  {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
];

describe('MasteryTierComponent', () => {
  beforeEachProviders(
      () =>
          [{provide: ActivatedRoute, useValue: new MockActivatedRoute()},

           BaseRequestOptions, MockBackend, {
             provide: Http,
             useFactory: function(backend, defaultOptions) {
               return new Http(backend, defaultOptions);
             },
             deps: [MockBackend, BaseRequestOptions]
           },

           LolApiService, MasteriesComponent, MasteryCategoryComponent, MasteryTierComponent]);

  let component: MasteryTierComponent;
  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.createAsync(MasteryTierComponent)
        .then((fixture: ComponentFixture<MasteryTierComponent>) => {
          component = fixture.componentInstance;
          component.data = data;
          fixture.detectChanges();
        });
  })));

  it('should add mastery rank', () => {
    let mastery = component.children.toArray()[0];
    mastery.enable();
    mastery.setRank(1);
    component.rankAdd(mastery);
    expect(mastery.getRank()).toBe(2);
  });

  it('should set mastery rank to max when rank is zero', () => {
    let mastery = component.children.toArray()[0];
    mastery.enable();
    component.rankAdd(mastery);
    expect(mastery.getRank()).toBe(5);
  });

  it('should trigger category rankAdd event', () => {
    spyOn(component.rankAdded, 'emit');
    expect(component.rankAdded.emit).not.toHaveBeenCalled();
    let mastery = component.children.toArray()[0];
    component.rankAdd(mastery);
    expect(component.rankAdded.emit).toHaveBeenCalled();
  });

  it('should trigger category rankRemoved event', () => {
    spyOn(component.rankRemoved, 'emit');
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
    let mastery = component.children.toArray()[0];
    component.rankRemove(mastery);
    expect(component.rankRemoved.emit).toHaveBeenCalled();
  });
});
