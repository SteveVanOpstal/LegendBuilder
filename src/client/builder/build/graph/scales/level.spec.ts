import {Samples} from '../../../../data/samples';

import {LevelScale} from './level';

describe('LevelScale', () => {
  let component: LevelScale;
  beforeEach(() => {
    component = new LevelScale([0, 1]);
  });

  it('should set scale on create', () => {
    expect(component.scale).not.toBeDefined();
    component.create();
    expect(component.scale).toBeDefined();
  });

  it('should return scale on get', () => {
    expect(component.scale).not.toBeDefined();
    component.create();
    expect(component.get()).toHaveEqualContent(component.scale);
  });

  it('should update', () => {
    const samples: Samples = {xp: [0, 1, 2], gold: [0, 1, 2]};
    component.create();
    component.update(samples);
    expect(component.scale.domain()).toHaveEqualContent([0, 2]);
  });
});
