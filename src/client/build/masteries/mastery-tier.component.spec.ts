import {TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {IconRankComponent} from '../../assets/icon-rank.component';
import {LolApiService} from '../../services/lolapi.service';
import {DDragonDirective} from '../../shared/ddragon.directive';
import {MockMockBackend, TestModule} from '../../testing';

import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

const data = [
  {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5}, null,
  {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
];

describe('MasteryTierComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: MockBackend, useValue: new MockMockBackend()},

        LolApiService, MasteryTierComponent
      ],
      declarations: [MasteryTierComponent, MasteryComponent, IconRankComponent, DDragonDirective],
      imports: [TestModule]
    });
  });

  let component: MasteryTierComponent;
  beforeEach(() => {
    let fixture = TestBed.createComponent(MasteryTierComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

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
