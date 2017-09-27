import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {Samples} from '../../../data/samples';
import {LolApiService} from '../../../services';
import {DDragonPipe} from '../../../shared/ddragon.pipe';
import {TestModule} from '../../../testing';

import {AbilitiesComponent} from './abilities.component';

xdescribe('AbilitiesComponent', () => {
  const samples: Samples = {xp: [17000], gold: []};

  let component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbilitiesComponent, DDragonPipe],
      providers: [AbilitiesComponent, LolApiService],
      imports: [TestModule]
    });

    const fixture = TestBed.createComponent(AbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const champion = {
    stats: {attackrange: 175, mpperlevel: 47, mp: 334},
    spells: [
      {
        effect:
            [undefined, [50, 75, 100, 125, 150], [35, 35, 35, 35, 35], [0.3, 0.35, 0.4, 0.45, 0.5]],
        vars: [{link: 'spelldamage', coeff: [0.6], key: 'a1'}],
        tooltip: '{{ a1 }} {{ e1 }} {{ f1 }}'
      },
      {tooltip: '{{f10}}'}
    ]
  };

  it('should create a tooltip', async(inject([MockBackend], (backend) => {
       spyOn(component, 'update');
       spyOn(component, 'createLevelScale');
       backend.success(champion);
       backend.success(samples);
       component.ngOnInit();
       component.lolApi.getCurrentChampion().subscribe(() => {
         expect(component.champion).toHaveEqualContent(champion);
         expect(component.update).toHaveBeenCalled();
         expect(champion.spells[0]['extendedTooltip']).toBe('0.6 50 175');
       });
       component.lolApi.getCurrentMatchData().subscribe(() => {
         expect(component.createLevelScale).toHaveBeenCalled();
       });
     })));

  it('should handle tooltip errors', async(inject([MockBackend], (backend) => {
       backend.success(champion);
       component.ngOnInit();
       expect(component.champion).toHaveEqualContent(champion);
       component.champion = champion;
       component.update();
       expect(champion.spells[1]['extendedTooltip']).toBe('[[error]]');
     })));

  it('should handle samples', async(inject([MockBackend], (backend) => {
       spyOn(component.xScaleLevel, 'update');
       backend.success(samples);
       component.ngOnInit();
       expect(component.samples).toHaveEqualContent(samples);
       expect(component.xScaleLevel.update).toHaveBeenCalled();
     })));

  it('should not handle empty samples', async(inject([MockBackend], (backend) => {
       spyOn(component.xScaleLevel, 'update');
       backend.success({xp: []});
       component.ngOnInit();
       expect(component.xScaleLevel.update).not.toHaveBeenCalled();
     })));
});
