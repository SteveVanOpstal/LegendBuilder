import {it, inject, beforeEach, beforeEachProviders} from 'angular2/testing';

import {HidePipe} from './hide.pipe';


describe('Shop HidePipe', () => {
  beforeEachProviders(() => [
    HidePipe
  ]);

  let items = [];
  let item1 = {};
  let item2 = {};
  let item3 = {};

  beforeEach(() => {
    item1 = {
      id: 1,
      hideFromAll: true
    };
    item2 = {
      id: 2,
      hideFromAll: false
    };
    item3 = {
      id: 3
    };
    items = [item1, item2, item3];
  });

  it('should filter', inject([HidePipe], (pipe) => {
    expect(pipe.transform(items)).toHaveEqualContent([item2, item3]);
  }));

  it('should not filter null', inject([HidePipe], (pipe) => {
    expect(pipe.transform(null)).toBe(null);
  }));
});
