import {TimeScale} from '../scales';
import {TimeAxis} from './time';

describe('TimeAxis', () => {
  let component: TimeAxis;
  beforeEach(() => {
    component = new TimeAxis(123, new TimeScale([0, 380]));
  });

  it('should set axis on create', () => {
    expect(component.axis).toBeDefined();
  });

  it('should return axis on get', () => {
    expect(component.get()).toHaveEqualContent(component.axis);
  });
});
