import {TimeScale} from '../scales/time';

import {TimeAxis} from './time';

describe('TimeAxis', () => {
  let component: TimeAxis;
  beforeEach(() => {
    component = new TimeAxis(123);
  });

  it('should set axis on create', () => {
    expect(component.axis).not.toBeDefined();
    component.create(new TimeScale([0, 380]));
    expect(component.axis).toBeDefined();
  });

  it('should return axis on get', () => {
    expect(component.axis).not.toBeDefined();
    component.create(new TimeScale([0, 380]));
    expect(component.get()).toHaveEqualContent(component.axis);
  });
});
