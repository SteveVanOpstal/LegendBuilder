import {tim} from './tim';

describe('tim', () => {
  let object = {};

  beforeEach(() => {
    object = {test: 'result'};
  });

  it('should handle "{{ test }}"', () => {
    const test = '{{ test }}';
    expect(tim(test, object)).toBe('result');
  });
  it('should handle "-*{{ test }}17"', () => {
    const test = '-*{{ test }}17';
    const result = tim(test, object);
    expect(result).toBe('-*result17');
  });
  it('should handle "{ { test } }"', () => {
    const test = '{{ test } }';
    expect(tim(test, object)).toBe('result');
  });
  it('should handle "{ {test} }"', () => {
    const test = '{ { test }}';
    const result = tim(test, object);
    expect(result).toBe('result');
  });
  it('should handle "{{0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ}}"', () => {
    const test = '{{0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ}}';
    const result =
        tim(test, {'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ': 'result'});
    expect(result).toBe('result');
  });

  it('shouldn\'t handle "{123{ test }abc}"', () => {
    const test = '{123{ test }abc}}';
    const result = tim(test, object);
    expect(result).toBe('{123{ test }abc}}');
  });
  it('shouldn\'t handle "{  {test}  }"', () => {
    const test = '{  {test}  }';
    const result = tim(test, object);
    expect(result).toBe('{  {test}  }');
  });
  it('should handle as [[error]] "{{fail}}"', () => {
    const test = '{{fail}}';
    const result = tim(test, object);
    expect(result).toBe('[[error]]');
  });
});
