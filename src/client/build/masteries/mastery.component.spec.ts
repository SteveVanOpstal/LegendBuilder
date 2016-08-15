import {ComponentFixture, TestBed, TestComponentBuilder, async, inject} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute} from '@angular/router';

import {LolApiService} from '../../misc/lolapi.service';
import {MockActivatedRoute} from '../../testing';

import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {Colors, MasteryComponent} from './mastery.component';

const data = {
  id: 0,
  description: ['test6121'],
  image: {full: '6121.png'},
  ranks: 5
};

describe('MasteryComponent', () => {
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

        LolApiService, MasteriesComponent, MasteryCategoryComponent, MasteryTierComponent,
        MasteryComponent
      ]
    });
  });

  let component: MasteryComponent;
  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.createAsync(MasteryComponent).then((fixture: ComponentFixture<MasteryComponent>) => {
      component = fixture.componentInstance;
      component.data = data;
      fixture.detectChanges();
    });
  })));

  it('should disable when there is no data', () => {
    spyOn(component, 'disable');
    expect(component.disable).not.toHaveBeenCalled();
    component.enabled = false;
    component.data = undefined;
    component.enable();
    expect(component.disable).toHaveBeenCalled();
  });

  it('should not disable when it has a rank', () => {
    spyOn(component, 'changed');
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

  it('should set active and color when enabled', () => {
    component.enable();
    component.setRank(1);
    expect(component.getActive()).toBeTruthy();
    expect(component.getColor()).toBe(Colors.yellow);
    component.setRank(0);
    expect(component.getActive()).toBeFalsy();
    expect(component.getColor()).toBe(Colors.blue);
  });
  it('should set active and color when disabled', () => {
    component.disable();
    expect(component.getActive()).toBeFalsy();
    expect(component.getColor()).toBe(Colors.gray);
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
    document.getElementsByTagName('div').item(1).dispatchEvent(new CustomEvent('click'));
    expect(component.rankAdd).toHaveBeenCalled();
  });
  it('should add rank on drag', () => {
    spyOn(component, 'rankAdd');
    expect(component.rankAdd).not.toHaveBeenCalled();
    document.getElementsByTagName('div').item(1).dispatchEvent(new CustomEvent('dragend'));
    expect(component.rankAdd).toHaveBeenCalled();
  });
  it('should remove rank on right click', () => {
    spyOn(component, 'rankRemove');
    expect(component.rankRemove).not.toHaveBeenCalled();
    document.getElementsByTagName('div').item(1).dispatchEvent(new CustomEvent('contextmenu'));
    expect(component.rankRemove).toHaveBeenCalled();
  });
});
