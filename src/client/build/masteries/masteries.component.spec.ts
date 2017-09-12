import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {IconErrorComponent} from '../../assets/icon-error.component';
import {IconLoadComponent} from '../../assets/icon-load.component';
import {IconRefreshComponent} from '../../assets/icon-refresh.component';
import {LolApiService} from '../../services';
import {DDragonPipe} from '../../shared/ddragon.pipe';
import {ErrorComponent} from '../../shared/error.component';
import {LoadingComponent} from '../../shared/loading.component';
import {TestModule} from '../../testing';

import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category/mastery-category.component';
import {MasteryTierComponent} from './mastery-tier/mastery-tier.component';
import {MasteryComponent} from './mastery/mastery.component';
import {RankComponent} from './mastery/rank.component';

const masteriesData = {
  tree: {
    Ferocity: [
      {masteryTreeItems: [{masteryId: 6121}, null, {masteryId: 6122}]},
      {masteryTreeItems: [{masteryId: 6121}, {masteryId: 6122}, {masteryId: 6122}]}
    ],
    Cunning: [{masteryTreeItems: [{masteryId: 6121}, null, {masteryId: 6122}]}],
    Resolve: [{masteryTreeItems: [{masteryId: 6121}, null, {masteryId: 6122}]}]
  },
  data: {
    6121: {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5},
    6122: {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
  }
};

const masteriesDataAltered = [
  {
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
  },
  {
    name: 'Cunning',
    tiers: [[
      {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5}, null,
      {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
    ]]
  },
  {
    name: 'Resolve',
    tiers: [[
      {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5}, null,
      {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
    ]]
  }
];

const providers = () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasteriesComponent, LolApiService],
      declarations: [
        MasteriesComponent, MasteryCategoryComponent, MasteryTierComponent, MasteryComponent,
        LoadingComponent, RankComponent, IconLoadComponent, IconRefreshComponent, ErrorComponent,
        IconErrorComponent, DDragonPipe
      ],
      imports: [TestModule]
    });
  });
};

describe('MasteriesComponent', () => {
  providers();

  let component: MasteriesComponent;
  beforeEach(() => {
    const fixture = TestBed.createComponent(MasteriesComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    component.data = masteriesDataAltered;
    fixture.detectChanges();
  });

  it('should be initialised', () => {
    expect(component.data).toBeDefined();
    expect(component.children).toBeDefined();
  });

  it('should enable', () => {
    const mastery = component.children.toArray()[0].children.toArray()[0].children.toArray()[0];
    mastery.enabled = false;
    component.enable();
    expect(mastery.enabled).toBeTruthy();
  });
  it('should disable', () => {
    const mastery = component.children.toArray()[0].children.toArray()[0].children.toArray()[0];
    mastery.enabled = true;
    component.disable();
    expect(mastery.enabled).toBeFalsy();
  });

  it('should get rank', () => {
    component.children.toArray()[0].children.toArray()[0].children.toArray()[0].setRank(2);
    component.children.toArray()[1].children.toArray()[0].children.toArray()[0].setRank(2);
    expect(component.getRank()).toBe(4);
  });

  it('should disable when rank is higher than 30', () => {
    spyOn(component, 'disable');
    expect(component.disable).not.toHaveBeenCalled();
    const tier = component.children.toArray()[0].children.toArray()[0];
    const mastery = tier.children.toArray()[0];
    mastery.setRank(30);
    component.rankAdd({tier: tier, mastery: mastery});
    expect(component.disable).toHaveBeenCalled();
  });
  it('should enable when rank is 29', () => {
    spyOn(component, 'enable');
    expect(component.enable).not.toHaveBeenCalled();
    component.children.toArray()[0].children.toArray()[0].children.toArray()[0].setRank(29);
    component.rankRemove();
    expect(component.enable).toHaveBeenCalled();
  });
  it('should not enable when rank is not 29', () => {
    spyOn(component, 'enable');
    expect(component.enable).not.toHaveBeenCalled();
    component.children.toArray()[0].children.toArray()[0].children.toArray()[0].setRank(30);
    component.rankRemove();
    expect(component.enable).not.toHaveBeenCalled();
  });

  it('should remove ranks when the total rank passes 30', () => {
    const tier1 = component.children.toArray()[0].children.toArray()[0];
    const tier2 = component.children.toArray()[1].children.toArray()[0];
    const mastery1 = tier1.children.toArray()[0];
    const mastery2 = tier1.children.toArray()[1];
    const mastery3 = tier2.children.toArray()[0];
    mastery1.setRank(2);
    mastery2.setRank(30);
    component.rankAdd({tier: tier1, mastery: mastery1});
    expect(mastery1.getRank()).toBe(2);
    expect(mastery2.getRank()).toBe(28);
    mastery1.setRank(2);
    mastery2.setRank(0);
    mastery3.enabled = true;
    mastery3.setRank(30);
    component.rankAdd({tier: tier1, mastery: mastery1});
    expect(mastery1.getRank()).toBe(0);
    expect(mastery3.getRank()).toBe(30);
  });
});

xdescribe('MasteriesComponent', () => {
  providers();

  xit('should get masteries',
      async(inject([MockBackend, MasteriesComponent], (backend, component: MasteriesComponent) => {
        component.ngOnInit();
        backend.success(masteriesData);
        expect(component.data).toHaveEqualContent(masteriesDataAltered);
      })));

  xit('should not get masteries',
      async(inject([MockBackend, MasteriesComponent], (backend, component) => {
        spyOn(component, 'transformData');
        expect(component.transformData).not.toHaveBeenCalled();
        component.ngOnInit();
        backend.error();
        expect(component.transformData).not.toHaveBeenCalled();
        expect(component.error).toBeTruthy();
      })));
});
