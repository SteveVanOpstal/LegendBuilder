import {inject, TestBed} from '@angular/core/testing';

import {ToIterablePipe} from './to-iterable.pipe';

describe('ToIterablePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ToIterablePipe]});
  });

  it('should transform object to array', inject([ToIterablePipe], (pipe) => {
       let test = {test: 'data', test2: 'data', test3: ['data', 'data'], test4: {test: 'data'}};
       let result = ['data', 'data', ['data', 'data'], {test: 'data'}];
       expect(pipe.transform(test)).toHaveEqualContent(result);
     }));

  it('should not transform an array', inject([ToIterablePipe], (pipe) => {
       let test = [{test: 'data'}, {test: 'data'}];
       expect(pipe.transform(test)).toHaveEqualContent(test);
     }));

  it('should not transform a number', inject([ToIterablePipe], (pipe) => {
       let test = 1;
       expect(pipe.transform(test)).toBe(test);
     }));

  it('should not transform a string', inject([ToIterablePipe], (pipe) => {
       let test = 'test';
       expect(pipe.transform(test)).toBe(test);
     }));

  it('should not transform a boolean', inject([ToIterablePipe], (pipe) => {
       let test = true;
       expect(pipe.transform(test)).toBe(test);
     }));

  it('should not transform undefined', inject([ToIterablePipe], (pipe) => {
       let test = undefined;
       expect(pipe.transform(test)).toBe(test);
     }));
});
