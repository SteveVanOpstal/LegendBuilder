import {beforeEachProviders, inject, it} from '@angular/core/testing';

import {CapitalizePipe} from './capitalize.pipe';

describe('CapitalizePipe', () => {
  beforeEachProviders(() => [CapitalizePipe]);

  it('should capitalize', inject([CapitalizePipe], (pipe) => {
       expect(pipe.transform('test')).toBe('Test');
       expect(pipe.transform('Test')).toBe('Test');
       expect(pipe.transform('tEST')).toBe('Test');
     }));
});
