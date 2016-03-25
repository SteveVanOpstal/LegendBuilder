import {provide} from 'angular2/core';

import {it, inject, beforeEachProviders} from 'angular2/testing';

import {SortPipe} from './sort.pipe';

describe('SortPipe', () => {
  beforeEachProviders(() => [
    SortPipe
  ]);

  let champions = [];

  beforeEach(() => {
    champions = [
      { id: 1, name: 'Amumu', info: { attack: 1, magic: 8, defense: 6, difficulty: 3 } },
      { id: 2, name: 'Ahri', info: { attack: 3, magic: 7, defense: 4, difficulty: 5 } },
      { id: 3, name: 'Vel\'Koz', info: { attack: 2, magic: 10, defense: 2, difficulty: 8 } }
    ];
  });

  it('should order alphabetical on \'null\'', inject([SortPipe], (pipe) => {
    let championIds = getChampionIds(pipe.transform(champions, [null]));
    expect(championIds).toHaveEqualContent([2, 1, 3]); // alphabetical order
  }));

  it('should order alphabetical on \'true\'', inject([SortPipe], (pipe) => {
    let championIds = getChampionIds(pipe.transform(champions, [true]));
    expect(championIds).toHaveEqualContent([2, 1, 3]); // alphabetical order
  }));

  it('should not filter on \'\'', inject([SortPipe], (pipe) => {
    let championIds = getChampionIds(pipe.transform(champions, ['']));
    expect(championIds).toHaveEqualContent([2, 1, 3]); // alphabetical order
  }));

  it('should not filter on invalid champions', inject([SortPipe], (pipe) => {
    champions = pipe.transform(null, ['attack']);
    expect(champions).toBe(null);
  }));

  it('should order by \'attack\'', inject([SortPipe], (pipe) => {
    let championIds = getChampionIds(pipe.transform(champions, ['attack']));
    expect(championIds).toHaveEqualContent([2, 3, 1]); // 'attack' order
  }));

  it('should order by \'magic\'', inject([SortPipe], (pipe) => {
    let championIds = getChampionIds(pipe.transform(champions, ['magic']));
    expect(championIds).toHaveEqualContent([3, 1, 2]); // 'magic' order
  }));

  it('should order by \'defense\'', inject([SortPipe], (pipe) => {
    let championIds = getChampionIds(pipe.transform(champions, ['defense']));
    expect(championIds).toHaveEqualContent([1, 2, 3]); // 'defense' order
  }));

  it('should order by \'difficulty\'', inject([SortPipe], (pipe) => {
    let championIds = getChampionIds(pipe.transform(champions, ['difficulty']));
    expect(championIds).toHaveEqualContent([3, 2, 1]); // 'difficulty' order
  }));
});

function getChampionIds(champions) {
  var array = [];
  champions.forEach(function(champion) {
    array.push(champion.id);
  });
  return array;
}
