import {TestBed} from '@angular/core/testing';

import {LolApiService} from '../../../../services';
import {DDragonPipe} from '../../../../shared/ddragon.pipe';
import {TestModule} from '../../../../testing';
import {MasteryTierComponent} from '../mastery-tier/mastery-tier.component';
import {MasteryComponent} from '../mastery/mastery.component';
import {RankComponent} from '../mastery/rank.component';

import {MasteryCategoryComponent} from './mastery-category.component';

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
  let component: MasteryCategoryComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasteryCategoryComponent, LolApiService],
      declarations: [
        MasteryCategoryComponent, MasteryTierComponent, MasteryComponent, RankComponent, DDragonPipe
      ],
      imports: [TestModule]
    });

    const fixture = TestBed.createComponent(MasteryCategoryComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

  it('should enable next tier when previous tier has a rank more than zero', () => {
    const tier1 = component.children.toArray()[0];
    const tier2 = component.children.toArray()[1];
    const mastery1 = tier1.children.toArray()[0];
    const mastery2 = tier2.children.toArray()[0];
    mastery1.setRank(5);
    mastery2.enabled = false;
    component.enable();
    expect(mastery2.enabled).toBeTruthy();
  });

  it('should lock previous tier when the tier is at max rank', () => {
    const tier1 = component.children.toArray()[0];
    const mastery1 = tier1.children.toArray()[0];
    spyOn(mastery1, 'lock');
    expect(mastery1.lock).not.toHaveBeenCalled();
    mastery1.unlock();
    const tier2 = component.children.toArray()[1];
    const mastery2 = tier2.children.toArray()[0];
    mastery2.enabled = true;
    mastery2.setRank(5);

    component.rankAdd({tier: tier2, mastery: mastery2});
    expect(mastery1.lock).toHaveBeenCalled();
  });
  it('should enable next tier when the tier is at max rank', () => {
    const tier1 = component.children.toArray()[0];
    const mastery1 = tier1.children.toArray()[0];
    mastery1.setRank(5);
    const tier2 = component.children.toArray()[1];
    const mastery2 = tier2.children.toArray()[0];
    mastery2.enabled = false;

    component.rankAdd({tier: tier1, mastery: mastery1});
    expect(mastery2.enabled).toBeTruthy();
  });

  it('should unlock previous tier when the tier is below max rank', () => {
    const tier1 = component.children.toArray()[0];
    const mastery1 = tier1.children.toArray()[0];
    spyOn(mastery1, 'unlock');
    expect(mastery1.unlock).not.toHaveBeenCalled();
    mastery1.lock();
    const tier2 = component.children.toArray()[1];
    const mastery2 = tier2.children.toArray()[0];
    mastery2.setRank(4);

    component.rankRemove({tier: tier2, mastery: mastery2});
    expect(mastery1.unlock).toHaveBeenCalled();
  });
  it('should disable next tier when the tier is below max rank', () => {
    const tier1 = component.children.toArray()[0];
    const mastery1 = tier1.children.toArray()[0];
    mastery1.setRank(4);
    const tier2 = component.children.toArray()[1];
    const mastery2 = tier2.children.toArray()[0];
    mastery2.enabled = true;

    component.rankRemove({tier: tier1, mastery: mastery1});
    expect(mastery2.enabled).toBeFalsy();
  });

  it('should lower the other rank in the tier', () => {
    const tier = component.children.toArray()[0];
    const mastery1 = tier.children.toArray()[0];
    const mastery2 = tier.children.toArray()[1];
    mastery1.setRank(5);
    mastery2.setRank(1);
    component.rankAdd({tier: tier, mastery: mastery1});
    expect(mastery2.getRank()).toBe(0);
  });

  it('should not add rank on an invalid event', () => {
    spyOn(component.rankRemoved, 'emit');
    const tier = component.children.toArray()[0];
    const mastery = tier.children.toArray()[0];
    mastery.setRank(5);
    component.rankAdd({tier: tier, mastery: undefined});
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
    component.rankAdd({tier: undefined, mastery: mastery});
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
  });
  it('should not remove rank on an invalid event', () => {
    spyOn(component.rankRemoved, 'emit');
    const tier = component.children.toArray()[0];
    const mastery = tier.children.toArray()[0];
    mastery.setRank(5);
    component.rankRemove({tier: tier, mastery: undefined});
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
    component.rankRemove({tier: undefined, mastery: mastery});
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
  });
});
