import {Samples} from '../../samples';
import {LevelScale} from '../scales/level';

import {LevelAxisLine, LevelAxisText} from './level';

describe('LevelAxisLine', () => {
  let component: LevelAxisLine;
  beforeEach(() => {
    component = new LevelAxisLine(123);
  });

  it('should set axis on create', () => {
    expect(component.axis).not.toBeDefined();
    component.create(new LevelScale([0, 380]));
    expect(component.axis).toBeDefined();
  });

  it('should return axis on get', () => {
    expect(component.axis).not.toBeDefined();
    component.create(new LevelScale([0, 380]));
    expect(component.get()).toHaveEqualContent(component.axis);
  });
});

describe('LevelAxisText', () => {
  let component: LevelAxisText;
  beforeEach(() => {
    component = new LevelAxisText(123);
  });

  it('should set axis on create', () => {
    expect(component.axis).not.toBeDefined();
    component.create(new LevelScale([0, 380]));
    expect(component.axis).toBeDefined();
  });

  it('should return axis on get', () => {
    expect(component.axis).not.toBeDefined();
    component.create(new LevelScale([0, 380]));
    expect(component.get()).toHaveEqualContent(component.axis);
  });

  it('should update', () => {
    let samples: Samples = {xp: [0, 1, 2], gold: [0, 1, 2]};
    component.create(new LevelScale([0, 380]));
    component.update(samples);
    expect(component.axis.tickValues()).toBeDefined();
  });
});
