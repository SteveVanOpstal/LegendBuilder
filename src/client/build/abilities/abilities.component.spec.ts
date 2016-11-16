import {inject, TestBed} from '@angular/core/testing';

import {DataService} from '../../services/data.service';
import {DDragonDirective} from '../../shared/ddragon.directive';
import {TestModule} from '../../testing';
import {Samples} from '../samples';

import {AbilitiesComponent} from './abilities.component';

describe('AbilitiesComponent', () => {
  let samples: Samples = {xp: [17000], gold: []};

  let component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbilitiesComponent, DDragonDirective],
      providers: [AbilitiesComponent, DataService],
      imports: [TestModule]
    });

    let fixture = TestBed.createComponent(AbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let champion = {
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

  it('should create a tooltip', inject([DataService], (data) => {
       component.ngOnInit();
       data.champion.notify(champion);
       expect(component.champion).toHaveEqualContent(champion);
       component.update();
       expect(champion.spells[0]['extendedTooltip']).toBe('0.6 50 175');
     }));

  it('should handle tooltip errors', inject([DataService], (data) => {
       component.ngOnInit();
       data.champion.notify(champion);
       expect(component.champion).toHaveEqualContent(champion);
       component.champion = champion;
       component.update();
       expect(champion.spells[1]['extendedTooltip']).toBe('[[error]]');
     }));

  it('should handle samples', inject([DataService], (data) => {
       spyOn(component.xScaleLevel, 'update');
       data.samples.notify(samples);
       component.ngOnInit();
       expect(component.samples).toHaveEqualContent(samples);
       expect(component.xScaleLevel.update).toHaveBeenCalled();
     }));

  it('should not handle empty samples', inject([DataService], (data) => {
       spyOn(component.xScaleLevel, 'update');
       data.samples.notify({xp: []});
       component.ngOnInit();
       expect(component.xScaleLevel.update).not.toHaveBeenCalled();
     }));
});
