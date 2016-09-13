import {inject, TestBed} from '@angular/core/testing';

import {NamePipe} from './name.pipe';

describe('NamePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [NamePipe]});
  });

  let champions = [];

  beforeEach(() => {
    champions = [{name: 'Amumu'}, {name: 'Ahri'}, {name: 'Vel\'Koz'}];
  });

  it('should not filter on \'undefined\'', inject([NamePipe], (pipe) => {
       champions = pipe.transform(champions, undefined);
       expect(champions.length).toBe(3);
     }));

  it('should not filter on \'true\'', inject([NamePipe], (pipe) => {
       champions = pipe.transform(champions, true);
       expect(champions.length).toBe(3);
     }));

  it('should not filter on invalid champions', inject([NamePipe], (pipe) => {
       champions = pipe.transform(undefined, 'Amumu');
       expect(champions).toBe(undefined);
     }));

  it('should not filter on \'\'', inject([NamePipe], (pipe) => {
       champions = pipe.transform(champions, '');
       expect(champions.length).toBe(3);
     }));

  it('should filter out name \'a\'', inject([NamePipe], (pipe) => {
       champions = pipe.transform(champions, 'a');
       expect(champions.length).toBe(2);
     }));

  it('should filter out name \'amumu\'', inject([NamePipe], (pipe) => {
       champions = pipe.transform(champions, 'amumu');
       expect(champions.length).toBe(1);
     }));

  it('should filter out name \'VelKo\'', inject([NamePipe], (pipe) => {
       champions = pipe.transform(champions, 'VelKo');
       expect(champions.length).toBe(1);
     }));

  it('should remove semicolon from names', inject([NamePipe], (pipe) => {
       expect(pipe.clean('am\'umu')).toBe('amumu');
     }));

  it('should lowercase names', inject([NamePipe], (pipe) => {
       expect(pipe.clean('AmUMu')).toBe('amumu');
     }));
});
