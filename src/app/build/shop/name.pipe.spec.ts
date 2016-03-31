import {provide} from 'angular2/core';

import {it, inject, beforeEach, beforeEachProviders} from 'angular2/testing';

import {NamePipe} from './name.pipe';

describe('NamePipe', () => {
  beforeEachProviders(() => [
    NamePipe
  ]);

  let champions = [];

  beforeEach(() => {
    champions = [{ name: 'Ravenous Hydra' }, { name: 'Titanic Hydra' }, { name: 'Dagger' }];
  });

  it('should not filter on \'null\'', inject([NamePipe], (pipe) => {
    champions = pipe.transform(champions, [null]);
    expect(champions.length).toBe(3);
  }));

  it('should not filter on \'true\'', inject([NamePipe], (pipe) => {
    champions = pipe.transform(champions, [true]);
    expect(champions.length).toBe(3);
  }));

  it('should not filter on invalid champions', inject([NamePipe], (pipe) => {
    champions = pipe.transform(null, ['Dagger']);
    expect(champions).toBe(null);
  }));

  it('should not filter on \'\'', inject([NamePipe], (pipe) => {
    champions = pipe.transform(champions, ['']);
    expect(champions.length).toBe(3);
  }));

  it('should filter out name \'e\'', inject([NamePipe], (pipe) => {
    champions = pipe.transform(champions, ['e']);
    expect(champions.length).toBe(2);
  }));

  it('should filter out name \'dagger\'', inject([NamePipe], (pipe) => {
    champions = pipe.transform(champions, ['dagger']);
    expect(champions.length).toBe(1);
  }));

  it('should filter out name \'Hydra\'', inject([NamePipe], (pipe) => {
    champions = pipe.transform(champions, ['Hydra']);
    expect(champions.length).toBe(2);
  }));

  it('should remove semicolon from names', inject([NamePipe], (pipe) => {
    expect(pipe.clean('da\'gger')).toBe('dagger');
  }));

  it('should lowercase names', inject([NamePipe], (pipe) => {
    expect(pipe.clean('DaGGer')).toBe('dagger');
  }));
});
