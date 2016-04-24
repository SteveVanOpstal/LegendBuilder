import {it, inject, beforeEachProviders} from 'angular2/testing';

import {TranslatePipe} from './translate.pipe';


describe('Shop TranslatePipe', () => {
  beforeEachProviders(() => [
    TranslatePipe
  ]);


  it('should translate', inject([TranslatePipe], (pipe) => {
    expect(pipe.transform('AURA')).toBe('Area Of Effect');
  }));

  it('should not translate', inject([TranslatePipe], (pipe) => {
    expect(pipe.transform(null)).toBe(null);
    expect(pipe.transform('Test')).toBe('Test');
  }));
});
