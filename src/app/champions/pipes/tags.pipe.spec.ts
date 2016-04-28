import {provide} from 'angular2/core';

import {it, inject, beforeEach, beforeEachProviders} from 'angular2/testing';

import {TagsPipe} from './tags.pipe';

describe('TagsPipe', () => {
  beforeEachProviders(() => [
    TagsPipe
  ]);

  let champions = [];

  beforeEach(() => {
    champions = [
      { name: 'Amumu', tags: ['Tank', 'Mage'] },
      { name: 'Ahri', tags: ['Mage', 'Assassin'] },
      { name: 'Tryndamere', tags: ['Fighter', 'Melee', 'Assassin'], }
    ];
  });

  it('should not filter on \'null\'', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(champions, null);
    expect(champions.length).toBe(3);
  }));

  it('should not filter on \'true\'', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(champions, true);
    expect(champions.length).toBe(3);
  }));

  it('should not filter on \'\'', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(champions, '');
    expect(champions.length).toBe(3);
  }));

  it('should not filter on invalid champions', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(null, ['Tank']);
    expect(champions).toBe(null);
  }));

  it('should filter by \'Mage\'', inject([TagsPipe], (pipe) => {
    let championes = pipe.transform(champions, ['Mage']);
    let championNames = getChampionNames(championes);
    expect(championNames.length).toBe(2);
    expect(championNames).toContain('Amumu');
    expect(championNames).toContain('Ahri');
  }));

  it('should filter by \'Mage, Tank\'', inject([TagsPipe], (pipe) => {
    let championNames = getChampionNames(pipe.transform(champions, ['Mage', 'Tank']));
    expect(championNames.length).toBe(1);
    expect(championNames).toContain('Amumu');
  }));

  it('should filter by \'Assassin\'', inject([TagsPipe], (pipe) => {
    let championNames = getChampionNames(pipe.transform(champions, ['Assassin']));
    expect(championNames.length).toBe(2);
    expect(championNames).toContain('Ahri');
    expect(championNames).toContain('Tryndamere');
  }));

  it('should filter by \'Fighter\'', inject([TagsPipe], (pipe) => {
    let championNames = getChampionNames(pipe.transform(champions, ['Fighter']));
    expect(championNames.length).toBe(1);
    expect(championNames).toContain('Tryndamere');
  }));

  it('should filter by \'Support\'', inject([TagsPipe], (pipe) => {
    champions = pipe.transform(champions, ['Support']);
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
