import {provide} from 'angular2/core';

import {it, inject, beforeEachProviders} from 'angular2/testing';

import {TagsPipe} from './tags.pipe';

describe('TagsPipe', () => {
  beforeEachProviders(() => [
    TagsPipe
  ]);

  let champions = [];

  beforeEach(() => {
    champions = [
      { name: 'Amumu', tags: ['tank', 'mage'] },
      { name: 'Ahri', tags: ['mage', 'assassin'] },
      { name: 'Tryndamere', tags: ['fighter', 'assassin'], }
    ];
  });

  it('should not filter on \'null\'', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(champions, [null]);
    expect(champions.length).toBe(3);
  }));

  it('should not filter on \'true\'', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(champions, [true]);
    expect(champions.length).toBe(3);
  }));

  it('should not filter on \'\'', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(champions, ['']);
    expect(champions.length).toBe(3);
  }));

  it('should not filter on invalid champions', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(null, [['tank']]);
    expect(champions).toBe(null);
  }));

  it('should filter by \'Mage\'', inject([TagsPipe], (pipe) => {
    let championes = pipe.transform(champions, [['mage']]);
    let championNames = getChampionNames(championes);
    expect(championNames.length).toBe(2);
    expect(championNames).toContain('Amumu');
    expect(championNames).toContain('Ahri');
  }));

  it('should filter by \'Mage, Tank\'', inject([TagsPipe], (pipe) => {
    let championNames = getChampionNames(pipe.transform(champions, [['mage', 'tank']]));
    expect(championNames.length).toBe(1);
    expect(championNames).toContain('Amumu');
  }));

  it('should filter by \'Assassin\'', inject([TagsPipe], (pipe) => {
    let championNames = getChampionNames(pipe.transform(champions, [['assassin']]));
    expect(championNames.length).toBe(2);
    expect(championNames).toContain('Ahri');
    expect(championNames).toContain('Tryndamere');
  }));

  it('should filter by \'Fighter\'', inject([TagsPipe], (pipe) => {
    let championNames = getChampionNames(pipe.transform(champions, [['fighter']]));
    expect(championNames.length).toBe(1);
    expect(championNames).toContain('Tryndamere');
  }));

  it('should filter by \'Support\'', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(champions, ['Fighter']);
    expect(champions.length).toBe(0);
  }));
});

function getChampionNames(champions) {
  var array = [];
  champions.forEach(function(champion) {
    array.push(champion.name);
  });
  return array;
}
