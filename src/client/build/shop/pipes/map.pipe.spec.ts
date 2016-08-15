import {TestBed, inject} from '@angular/core/testing';

import {MapPipe} from './map.pipe';

describe('Shop MapPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [MapPipe]});
  });

  let items = [];
  let item1 = {};
  let item2 = {};
  let item3 = {};
  let item4 = {};

  beforeEach(() => {
    item1 = {id: 1, maps: {1: true}};
    item2 = {id: 2, maps: {1: true, 2: true}};
    item3 = {id: 3, maps: {1: false}};
    item4 = {id: 4};
    items = [item1, item2, item3, item4];
  });

  it('should filter', inject([MapPipe], (pipe) => {
       expect(pipe.transform(items, 2)).toHaveEqualContent([item2]);
       expect(pipe.transform(items, 1)).toHaveEqualContent([item1, item2]);
     }));

  it('should not filter undefined', inject([MapPipe], (pipe) => {
       expect(pipe.transform(undefined, 1)).toBe(undefined);
       expect(pipe.transform(items, undefined)).toBe(items);
     }));
});
