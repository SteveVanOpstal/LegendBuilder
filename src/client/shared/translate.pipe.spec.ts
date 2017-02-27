import {inject, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services/lolapi.service';
import {CoreModule, HttpModule, MockActivatedRoute, MockRouter} from '../testing';

import {TranslatePipe} from './translate.pipe';

describe('Shop TranslatePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranslatePipe],
      providers: [
        {provide: ActivatedRoute, useValue: new MockActivatedRoute()},
        {provide: Router, useValue: new MockRouter()}, LolApiService, TranslatePipe
      ],
      imports: [CoreModule, HttpModule]
    });

  });

  it('should translate', inject([TranslatePipe], (pipe) => {
       expect(pipe.transform('AURA')).toBe('Area Of Effect');
     }));

  it('should not translate', inject([TranslatePipe], (pipe) => {
       expect(pipe.transform('Test')).toBe('Test');
     }));
});
