import {addProviders, inject} from '@angular/core/testing';

import {ChampionPipe} from './champion.pipe';

describe('Shop ChampionPipe', () => {
  beforeEach(() => {
    addProviders([ChampionPipe]);
  });

  let items = [];
  let item1 = {};
  let item2 = {};
  let item3 = {};

  beforeEach(() => {
    item1 = {id: 1, requiredChampion: 5};
    item2 = {id: 2, requiredChampion: 3};
    item3 = {id: 3};
    items = [item1, item2, item3];
  });

  it('should filter', inject([ChampionPipe], (pipe) => {
       expect(pipe.transform(items, 3)).toHaveEqualContent([item2, item3]);
     }));

  it('should not filter undefined', inject([ChampionPipe], (pipe) => {
       expect(pipe.transform(undefined, 3)).toBe(undefined);
       expect(pipe.transform(items, undefined)).toBe(items);
     }));
});
