import {inject, TestBed} from '@angular/core/testing';

import {CapitalizePipe} from './capitalize.pipe';

describe('CapitalizePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [CapitalizePipe]});
  });

  it('should capitalize', inject([CapitalizePipe], (pipe) => {
       expect(pipe.transform('test')).toBe('Test');
       expect(pipe.transform('Test')).toBe('Test');
       expect(pipe.transform('tEST')).toBe('Test');
     }));
});
