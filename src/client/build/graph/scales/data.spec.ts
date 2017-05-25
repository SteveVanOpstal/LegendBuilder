import {DataScale} from './data';

describe('DataScale', () => {
  let component: DataScale;
  beforeEach(() => {
    component = new DataScale([0, 1], [0, 1]);
  });

  it('should set scale on create', () => {
    expect(component.scale).toBeDefined();
  });

  it('should return scale on get', () => {
    expect(component.get()).toHaveEqualContent(component.scale);
  });
});
