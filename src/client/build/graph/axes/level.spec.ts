import {addProviders, inject, it} from '@angular/core/testing';

import {Samples} from '../../samples';
import {LevelScale} from '../scales/level';
import {LevelAxisLine, LevelAxisText} from './level';

describe('LevelAxisLine', () => {
  beforeEach(() => {
    addProviders([LevelAxisLine]);
  });

  it('should set axis on create', inject([LevelAxisLine], (component) => {
       expect(component.axis).not.toBeDefined();
       component.create(new LevelScale());
       expect(component.axis).toBeDefined();
     }));

  it('should return axis on get', inject([LevelAxisLine], (component) => {
       expect(component.axis).not.toBeDefined();
       component.create(new LevelScale());
       expect(component.get()).toHaveEqualContent(component.axis);
     }));
});

describe('LevelAxisText', () => {
  beforeEach(() => {
    addProviders([LevelAxisText]);
  });

  it('should set axis on create', inject([LevelAxisText], (component) => {
       expect(component.axis).not.toBeDefined();
       component.create(new LevelScale());
       expect(component.axis).toBeDefined();
     }));

  it('should return axis on get', inject([LevelAxisText], (component) => {
       expect(component.axis).not.toBeDefined();
       component.create(new LevelScale());
       expect(component.get()).toHaveEqualContent(component.axis);
     }));

  it('should update', inject([LevelAxisText], (component) => {
       let samples: Samples = {xp: [0, 1, 2], gold: [0, 1, 2]};
       component.create(new LevelScale());
       component.update(samples);
       expect(component.axis.tickValues()).toBeDefined();
     }));
});
