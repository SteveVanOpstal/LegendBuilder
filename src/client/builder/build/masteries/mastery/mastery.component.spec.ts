import {TestBed} from '@angular/core/testing';

import {LolApiService} from '../../../../services';
import {DDragonPipe} from '../../../../shared/ddragon.pipe';
import {TestModule} from '../../../../testing';

import {MasteryComponent} from './mastery.component';
import {RankComponent} from './rank.component';

const data = {
  id: 0,
  description: ['test6121'],
  image: {full: '6121.png'},
  ranks: 5
};

describe('MasteryComponent', () => {
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LolApiService],
      declarations: [MasteryComponent, RankComponent, DDragonPipe],
      imports: [TestModule]
    });

    const fixture = TestBed.createComponent(MasteryComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

  it('should disable when there is no data', () => {
    spyOn(component, 'disable');
    expect(component.disable).not.toHaveBeenCalled();
    component.enabled = false;
    component.data = undefined;
    component.enable();
    expect(component.disable).toHaveBeenCalled();
  });

  it('should not disable when it has a rank', () => {
    spyOn(component, 'update');
    component.enabled = true;
    component.setRank(1);
    component.disable();
    expect(component.getRank()).toBe(1);
    expect(component.enabled).toBeTruthy();
  });

  it('should get max rank zero when there is no data', () => {
    component.data = undefined;
    expect(component.getMaxRank()).toBe(0);
    component.data = {ranks: undefined};
    expect(component.getMaxRank()).toBe(0);
  });

  it('should not add a rank when disabled', () => {
    component.setRank(0);
    component.data = {ranks: 5};
    component.disable();
    component.rankAdd();
    expect(component.getRank()).toBe(0);
  });

  it('should remove rank', () => {
    component.enable();
    component.setRank(2);
    component.unlock();
    component.rankRemove();
    expect(component.getRank()).toBe(1);
  });

  it('should not remove rank when rank is zero', () => {
    component.enable();
    component.setRank(0);
    component.unlock();
    component.rankRemove();
    expect(component.getRank()).toBe(0);
  });

  it('should not remove rank when disabled', () => {
    component.enable();
    component.setRank(2);
    component.enabled = false;
    component.rankRemove();
    expect(component.getRank()).toBe(2);
  });

  it('should not remove rank when locked', () => {
    component.enable();
    component.setRank(2);
    component.lock();
    component.rankRemove();
    expect(component.getRank()).toBe(2);
  });

  it('should set active when enabled', () => {
    component.enable();
    component.setRank(1);
    expect(component.getActive()).toBeTruthy();
    component.setRank(0);
    expect(component.getActive()).toBeFalsy();
  });
  it('should set active when disabled', () => {
    component.disable();
    expect(component.getActive()).toBeFalsy();
  });

  it('should trigger tier rankAdd event', () => {
    spyOn(component.rankAdded, 'emit');
    expect(component.rankAdded.emit).not.toHaveBeenCalled();
    component.enabled = true;
    component.rankAdd();
    expect(component.rankAdded.emit).toHaveBeenCalled();
  });

  it('should trigger tier rankRemoved event', () => {
    spyOn(component.rankRemoved, 'emit');
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
    component.enabled = true;
    component.setRank(1);
    component.rankRemove();
    expect(component.rankRemoved.emit).toHaveBeenCalled();
    expect(component.getRank()).toBe(0);
  });

  it('should add rank on click', () => {
    spyOn(component, 'rankAdd');
    expect(component.rankAdd).not.toHaveBeenCalled();
    component.clicked();
    expect(component.rankAdd).toHaveBeenCalled();
  });
  it('should add rank on drag', () => {
    spyOn(component, 'rankAdd');
    expect(component.rankAdd).not.toHaveBeenCalled();
    component.dragEnd();
    expect(component.rankAdd).toHaveBeenCalled();
  });
  it('should remove rank on right click', () => {
    spyOn(component, 'rankRemove');
    expect(component.rankRemove).not.toHaveBeenCalled();
    component.rightClicked();
    expect(component.rankRemove).toHaveBeenCalled();
  });

  it('should add the mastery description', () => {
    component.data.description = ['test'];
    component.update();
    expect(component.description).toBe('test');
  });

  it('should add all mastery descriptions when not selected', () => {
    component.data.description = ['test1', 'test2'];
    component.rank = 0;
    component.update();
    expect(component.description).toBe('test1/2');
  });

  it('should add the mastery description of the associated rank', () => {
    component.data.description = ['test1', 'test2'];
    component.rank = 2;
    component.update();
    expect(component.description).toBe('test2');
  });

  it('should add the mastery description of the associated rank', () => {
    component.data.description = ['test1', 'test2'];
    component.rank = 3;
    component.update();
    expect(component.description).toBe('test2');
  });
});
