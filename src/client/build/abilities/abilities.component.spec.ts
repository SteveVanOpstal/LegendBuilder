import {ElementRef} from '@angular/core';
import {inject, TestBed} from '@angular/core/testing';

import {DataService} from '../../services/data.service';
import {MockElementRef} from '../../testing';

import {AbilitiesComponent} from './abilities.component';

describe('AbilitiesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ElementRef, useValue: new MockElementRef()},

        AbilitiesComponent, DataService
      ]
    });
  });

  beforeEach(inject([AbilitiesComponent], (component) => {
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

  it('should create a tooltip', inject([AbilitiesComponent], (component) => {
       let extendedTooltip = component.getExtendedTooltip(0);
       expect(extendedTooltip).toBe('0.6 50 175');
     }));

  it('should handle tooltip errors', inject([AbilitiesComponent], (component) => {
       component.champion.spells[0].sanitizedTooltip = '{{f10}}';
       let extendedTooltip = component.getExtendedTooltip(0);
       expect(extendedTooltip).toBe('[[error]]');
     }));
});
