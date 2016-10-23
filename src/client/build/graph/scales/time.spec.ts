import {TimeScale} from './time';

describe('TimeScale', () => {
  let component: TimeScale;
  beforeEach(() => {
    component = new TimeScale([0, 1]);
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
});
