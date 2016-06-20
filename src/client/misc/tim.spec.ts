import {tim} from './tim';

describe('tim', () => {
  let object = {};

  beforeEach(() => { object = {test: 'result'}; });

  it('should handle "{{ test }}"', () => {
    let test = '{{ test }}';
    expect(tim(test, object)).toBe('result');
  });
  it('should handle "-*{{ test }}17"', () => {
    let test = '-*{{ test }}17';
    let result = tim(test, object);
    expect(result).toBe('-*result17');
  });
  it('should handle "{ { test } }"', () => {
    let test = '{{ test } }';
    expect(tim(test, object)).toBe('result');
  });
  it('should handle "{ {test} }"', () => {
    let test = '{ { test }}';
    let result = tim(test, object);
    expect(result).toBe('result');
  });
  it('should handle "{{0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ}}"', () => {
    let test = '{{0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ}}';
    let result = tim(test, {'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ': 'result'});
    expect(result).toBe('result');
  });

  it('shouldn\'t handle "{123{ test }abc}"', () => {
    let test = '{123{ test }abc}}';
    let result = tim(test, object);
    expect(result).toBe('{123{ test }abc}}');
  });
  it('shouldn\'t handle "{  {test}  }"', () => {
    let test = '{  {test}  }';
    let result = tim(test, object);
    expect(result).toBe('{  {test}  }');
  });
  it('should handle as [[error]] "{{fail}}"', () => {
    let test = '{{fail}}';
    let result = tim(test, object);
    expect(result).toBe('[[error]]');
  });
});
