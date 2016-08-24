import {inject, TestBed} from '@angular/core/testing';

import {AbilitySequenceComponent} from './ability-sequence.component';

describe('AbilitySequenceComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [AbilitySequenceComponent]});
  });

  beforeEach(inject([AbilitySequenceComponent], (component) => {
    component.champion = {
      stats: {attackrange: 175, mpperlevel: 47, mp: 334},
      spells: [{
        effect:
            [undefined, [50, 75, 100, 125, 150], [35, 35, 35, 35, 35], [0.3, 0.35, 0.4, 0.45, 0.5]],
        vars: [{link: 'spelldamage', coeff: [0.6], key: 'a1'}],
        sanitizedTooltip: '{{ a1 }} {{ e1 }} {{ f1 }}'
      }]
    };
  }));

  it('should create a tooltip', inject([AbilitySequenceComponent], (component) => {
       let extendedTooltip = component.getExtendedTooltip(0);
       expect(extendedTooltip).toBe('0.6 50 175');
     }));

  it('should handle tooltip errors', inject([AbilitySequenceComponent], (component) => {
       component.champion.spells[0].sanitizedTooltip = '{{f10}}';
       let extendedTooltip = component.getExtendedTooltip(0);
       expect(extendedTooltip).toBe('[[error]]');
     }));
});
