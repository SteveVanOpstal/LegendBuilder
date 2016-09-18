import {TestBed} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute} from '@angular/router';

import {IconRankComponent} from '../../assets/icon-rank.component';
import {DDragonDirective} from '../../misc/ddragon.directive';
import {LolApiService} from '../../services/lolapi.service';
import {MockActivatedRoute} from '../../testing';

import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

const data = {
  name: 'Ferocity',
  tiers: [
    [
      {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5}, null,
      {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
    ],
    [
      {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5},
      {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5},
      {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
    ]
  ]
};

describe('MasteryCategoryComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ActivatedRoute, useValue: new MockActivatedRoute()},

        BaseRequestOptions, MockBackend, {
          provide: Http,
          useFactory: (backend, defaultOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },

        LolApiService, MasteryCategoryComponent
      ],
      declarations: [
        MasteryCategoryComponent, MasteryTierComponent, MasteryComponent, IconRankComponent,
        DDragonDirective
      ]
    });
  });

  let component: MasteryCategoryComponent;
  beforeEach(() => {
    let fixture = TestBed.createComponent(MasteryCategoryComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

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

    component.rankAdd({tier: tier2, mastery: mastery2});
    expect(mastery1.lock).toHaveBeenCalled();
  });
  it('should enable next tier when the tier is at max rank', () => {
    let tier1 = component.children.toArray()[0];
    let mastery1 = tier1.children.toArray()[0];
    mastery1.setRank(5);
    let tier2 = component.children.toArray()[1];
    let mastery2 = tier2.children.toArray()[0];
    mastery2.enabled = false;

    component.rankAdd({tier: tier1, mastery: mastery1});
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

    component.rankRemove({tier: tier2, mastery: mastery2});
    expect(mastery1.unlock).toHaveBeenCalled();
  });
  it('should disable next tier when the tier is below max rank', () => {
    let tier1 = component.children.toArray()[0];
    let mastery1 = tier1.children.toArray()[0];
    mastery1.setRank(4);
    let tier2 = component.children.toArray()[1];
    let mastery2 = tier2.children.toArray()[0];
    mastery2.enabled = true;

    component.rankRemove({tier: tier1, mastery: mastery1});
    expect(mastery2.enabled).toBeFalsy();
  });

  it('should lower the other rank in the tier', () => {
    let tier = component.children.toArray()[0];
    let mastery1 = tier.children.toArray()[0];
    let mastery2 = tier.children.toArray()[1];
    mastery1.setRank(5);
    mastery2.setRank(1);
    component.rankAdd({tier: tier, mastery: mastery1});
    expect(mastery2.getRank()).toBe(0);
  });

  it('should not add rank on an invalid event', () => {
    spyOn(component.rankRemoved, 'emit');
    let tier = component.children.toArray()[0];
    let mastery = tier.children.toArray()[0];
    mastery.setRank(5);
    component.rankAdd({tier: tier, mastery: undefined});
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
    component.rankAdd({tier: undefined, mastery: mastery});
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
  });
  it('should not remove rank on an invalid event', () => {
    spyOn(component.rankRemoved, 'emit');
    let tier = component.children.toArray()[0];
    let mastery = tier.children.toArray()[0];
    mastery.setRank(5);
    component.rankRemove({tier: tier, mastery: undefined});
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
    component.rankRemove({tier: undefined, mastery: mastery});
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
  });
});
