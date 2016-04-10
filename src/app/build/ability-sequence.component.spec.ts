import {it, inject, beforeEachProviders, beforeEach} from 'angular2/testing';

import {AbilitySequenceComponent} from './ability-sequence.component';

describe('AbilitySequenceComponent', () => {
  beforeEachProviders(() => [
    AbilitySequenceComponent
  ]);

  beforeEach(inject([AbilitySequenceComponent], (component) => {
    component.champion = {
      stats: {
        attackrange: 175,
        mpperlevel: 47,
        mp: 334,
      },
      spells: [{
        effect: [
          null,
          [50, 75, 100, 125, 150],
          [35, 35, 35, 35, 35],
          [0.3, 0.35, 0.4, 0.45, 0.5],
        ],
        vars: [
          {
            link: 'spelldamage',
            coeff: [0.6],
            key: 'a1'
          }
        ],
        sanitizedTooltip: 'Test {{ e1 }} (+{{ f1 }}) (+{{ a1 }}) e3 {{ e2 } }%.'
      }]
    };
  }));


  it('should create a tooltip', inject([AbilitySequenceComponent], (component) => {
    let extendedTooltip = component.getExtendedTooltip(0);
    expect(extendedTooltip).toBe('Test 50 (+175) (+0.6) e3 35%.');
  }));

  it('should handle tooltip errors', inject([AbilitySequenceComponent], (component) => {
    component.champion.spells[0].sanitizedTooltip = 'Test {{ e1 }} (+{{ f1 }}) (+{{ a1 }}) e3 {{ e2 } }%. {{f10}} {{f2}}  {{e3}}';
    let extendedTooltip = component.getExtendedTooltip(0);
    expect(extendedTooltip).toBe('Test 50 (+175) (+0.6) e3 35%. [[error]] 47  0.3');
  }));
});
