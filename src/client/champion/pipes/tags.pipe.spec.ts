import {inject, TestBed} from '@angular/core/testing';

import {TagsPipe} from './tags.pipe';

describe('Champion TagsPipe', () => {
  let champions = [];
  const champion1 = {name: 'Amumu', tags: ['Tank', 'Mage']};
  const champion2 = {name: 'Ahri', tags: ['Mage', 'Assassin']};
  const champion3 = {name: 'Tryndamere', tags: ['Fighter', 'Melee', 'Assassin']};

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [TagsPipe]});

    champions = [champion1, champion2, champion3];
  });

  it('should not filter on \'undefined\'', inject([TagsPipe], (pipe) => {
       champions = pipe.transform(champions, undefined);
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
       champions = pipe.transform(undefined, ['Tank']);
       expect(champions).toBe(undefined);
     }));

  it('should filter by \'Mage\'', inject([TagsPipe], (pipe) => {
       const result = pipe.transform(champions, ['Mage']);
       expect(result.length).toBe(2);
       expect(result).toContain(champion1);
       expect(result).toContain(champion2);
     }));

  it('should filter by \'Mage, Tank\'', inject([TagsPipe], (pipe) => {
       const result = pipe.transform(champions, ['Mage', 'Tank']);
       expect(result).toHaveEqualContent([champion1]);
     }));

  it('should filter by \'Assassin\'', inject([TagsPipe], (pipe) => {
       const result = pipe.transform(champions, ['Assassin']);
       expect(result.length).toBe(2);
       expect(result).toContain(champion2);
       expect(result).toContain(champion3);
     }));

  it('should filter by \'Fighter\'', inject([TagsPipe], (pipe) => {
       const result = pipe.transform(champions, ['Fighter']);
       expect(result).toHaveEqualContent([champion3]);
     }));

  it('should filter by \'Support\'', inject([TagsPipe], (pipe) => {
       champions = pipe.transform(champions, ['Support']);
       expect(champions.length).toBe(0);
     }));
});
