import {DataScale} from '../scales/data';
import {DataAxis} from './data';

describe('DataAxis', () => {
  let component: DataAxis;
  beforeEach(() => {
    component = new DataAxis();
  });

  it('should set axis on create', () => {
    expect(component.axis).not.toBeDefined();
    component.create(new DataScale([400, 0]));
    expect(component.get()).toBeDefined();
  });

  it('should return axis on get', () => {
    expect(component.axis).not.toBeDefined();
    component.create(new DataScale([400, 0]));
    expect(component.get()).toHaveEqualContent(component.axis);
  });
});
