import {addProviders, inject} from '@angular/core/testing';

import {Samples} from '../../samples';
import {LevelScale} from './level';

describe('LevelScale', () => {
  beforeEach(() => {
    addProviders([LevelScale]);
  });

  it('should set scale on create', inject([LevelScale], (component) => {
       expect(component.scale).not.toBeDefined();
       component.create();
       expect(component.scale).toBeDefined();
     }));

  it('should return scale on get', inject([LevelScale], (component) => {
       expect(component.scale).not.toBeDefined();
       component.create();
       expect(component.get()).toHaveEqualContent(component.scale);
     }));

  it('should update', inject([LevelScale], (component) => {
       let samples: Samples = {xp: [0, 1, 2], gold: [0, 1, 2]};
       component.create();
       component.update(samples);
       expect(component.scale.domain()).toHaveEqualContent([0, 2]);
     }));
});
