import {Component, DebugElement} from '@angular/core';
import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services/lolapi.service';
import {CoreModule, HttpModule, MockActivatedRoute, MockRouter} from '../testing';

import {DDragonPipe, defaultImage} from './ddragon.pipe';

@Component({template: `<img [attr.src]="'test.png' | lbDDragon">`})
class TestComponent {
}

let realm = {
  'v': '[realm-version]',
  'cdn': 'https://url/cdn',
  'n': {
    'champion': '[champion-version]',
    'profileicon': '[profileicon-version]',
    'item': '[item-version]',
    'map': '[map-version]',
    'mastery': '[mastery-version]',
    'language': '[language-version]',
    'summoner': '[summoner-version]',
    'rune': '[rune-version]'
  }
};

describe('DDragonPipe', () => {
  let testComponent: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DDragonPipe, TestComponent],
      providers: [
        {provide: ActivatedRoute, useValue: new MockActivatedRoute()},
        {provide: Router, useValue: new MockRouter()}, LolApiService, DDragonPipe
      ],
      imports: [CoreModule, HttpModule]
    });

    let fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    testComponent = fixture.debugElement.children[0];
  });

  it('should use a default url when image or realm is unavailable',
     inject([DDragonPipe], (pipe) => {
       let result = pipe.buildImage('test.png', undefined);
       expect(result).toBeDefined();
       result = pipe.buildImage(undefined, realm);
       expect(result).toBeDefined();
     }));

  it('should create a correct url', inject([DDragonPipe], (pipe) => {
       let result = pipe.buildImage('test.png', realm);
       expect(result).toBe('https://url/cdn/[realm-version]/img/test.png');
     }));

  it('should create a correct \'ui\' url', inject([DDragonPipe], (pipe) => {
       let result = pipe.buildImage('ui/test.png', realm);
       expect(result).toBe('https://url/cdn/5.5.1/img/ui/test.png');
     }));

  it('should create a correct \'champion\' url', inject([DDragonPipe], (pipe) => {
       let result = pipe.buildImage('champion/test.png', realm);
       expect(result).toBe('https://url/cdn/[champion-version]/img/champion/test.png');
     }));

  it('should create a correct \'profileicon\' url', inject([DDragonPipe], (pipe) => {
       let result = pipe.buildImage('profileicon/test.png', realm);
       expect(result).toBe('https://url/cdn/[profileicon-version]/img/profileicon/test.png');
     }));

  it('should create a correct \'junk\' url', inject([DDragonPipe], (pipe) => {
       let result = pipe.buildImage('junk/test.png', realm);
       expect(result).toBe('https://url/cdn/[realm-version]/img/junk/test.png');
     }));

  it('should create a correct \'champion/loading\' url', inject([DDragonPipe], (pipe) => {
       let result = pipe.buildImage('champion/loading/test.png', realm);
       expect(result).toBe('https://url/cdn/img/champion/loading/test.png');
     }));

  it('should set a default image', () => {
    expect(testComponent.nativeElement.src).toBe(defaultImage);
  });

  it('should set requested image', async(inject([MockBackend], (backend) => {
       backend.success(realm);
       // expect(testComponent.nativeElement.src)
       // .toBe('https://url/cdn/[realm-version]/img/test.png');
     })));
});
