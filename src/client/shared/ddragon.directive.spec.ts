import {Component, DebugElement /*, ElementRef*/} from '@angular/core';
import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services/lolapi.service';
import {CoreModule, HttpModule, MockActivatedRoute, MockRouter} from '../testing';

import {DDragonDirective, defaultImage} from './ddragon.directive';

@Component({
  template: `
  <img [ddragon]="'test.png'" [x]="1" [y]="1">
  <img [ddragon]="'test.png'">
  <svg xmlns="http://www.w3.org/2000/svg"><image [ddragon]="'test.png'"></image></svg>`
})
class TestComponent {
}

let realm = {
  'v': '[realm-version]',
  'cdn': 'http://url/cdn',
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


function addCommonProviders() {
  TestBed.configureTestingModule({
    declarations: [DDragonDirective, TestComponent],
    providers: [
      {provide: ActivatedRoute, useValue: new MockActivatedRoute()},
      {provide: Router, useValue: new MockRouter()}, DDragonDirective, LolApiService
    ],
    imports: [CoreModule, HttpModule]
  });
}

function getDirective(index: number): DebugElement {
  let fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();

  let directives = fixture.debugElement.queryAll(By.directive(DDragonDirective));
  return directives[index].injector.get(DDragonDirective);
}


describe('DDragonDirective', () => {
  beforeEach(() => {
    addCommonProviders();
  });

  it('should use a default url when image or realm is unavailable',
     inject([DDragonDirective], (directive) => {
       let result = directive.buildImage('test.png', undefined);
       expect(result).toBeDefined();
       result = directive.buildImage('test.png', undefined);
       expect(result).toBeDefined();
     }));

  it('should create a correct url', inject([DDragonDirective], (directive) => {
       let result = directive.buildImage('test.png', realm);
       expect(result).toBe('http://url/cdn/[realm-version]/img/test.png');
     }));

  it('should create a correct \'ui\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildImage('ui/test.png', realm);
       expect(result).toBe('http://url/cdn/5.5.1/img/ui/test.png');
     }));

  it('should create a correct \'champion\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildImage('champion/test.png', realm);
       expect(result).toBe('http://url/cdn/[champion-version]/img/champion/test.png');
     }));

  it('should create a correct \'profileicon\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildImage('profileicon/test.png', realm);
       expect(result).toBe('http://url/cdn/[profileicon-version]/img/profileicon/test.png');
     }));

  it('should create a correct \'junk\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildImage('junk/test.png', realm);
       expect(result).toBe('http://url/cdn/[realm-version]/img/junk/test.png');
     }));

  it('should create a correct \'champion/loading\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildImage('champion/loading/test.png', realm);
       expect(result).toBe('http://url/cdn/img/champion/loading/test.png');
     }));

  it('should not update image without realm', inject([DDragonDirective], (directive) => {
       spyOn(directive, 'setImage');
       expect(directive.setImage).not.toHaveBeenCalled();
       directive.ngOnChanges();
       expect(directive.setImage).not.toHaveBeenCalled();
     }));

  it('should update image when a change occurs',
     async(inject([MockBackend, DDragonDirective], (backend, directive) => {
       spyOn(directive, 'setImage');
       expect(directive.setImage).not.toHaveBeenCalled();
       directive.realm = realm;
       directive.ngOnChanges();
       expect(directive.setImage).toHaveBeenCalled();
     })));


  describe('style', () => {
    let directive;
    beforeEach(() => {
      addCommonProviders();
      directive = getDirective(0);
    });

    it('should initialise with a default image', () => {
      expect(directive.el.nativeElement.style.background).toBe('url(' + defaultImage + ') 1px 1px');
    });

    it('should set requested image', async(inject([MockBackend], (backend) => {
         directive.ngOnInit();
         backend.success(realm);
         expect(directive.el.nativeElement.style.background)
             .toBe('url(http://url/cdn/[realm-version]/img/test.png) 1px 1px');
       })));
  });

  describe('src', () => {
    let directive;
    beforeEach(() => {
      addCommonProviders();
      directive = getDirective(1);
    });

    it('should initialise with a default image', () => {
      expect(directive.el.nativeElement.src).toBe(defaultImage);
    });

    it('should set requested image', async(inject([MockBackend], (backend) => {
         directive.ngOnInit();
         backend.success(realm);
         expect(directive.el.nativeElement.src).toBe('http://url/cdn/[realm-version]/img/test.png');
       })));
  });

  describe('href', () => {
    let directive;
    beforeEach(() => {
      addCommonProviders();
      directive = getDirective(2);
    });

    it('should initialise with a default image', () => {
      expect(directive.el.nativeElement.getAttribute('href')).toBe(defaultImage);
    });

    it('should set requested image', async(inject([MockBackend], (backend) => {
         directive.ngOnInit();
         backend.success(realm);
         expect(directive.el.nativeElement.getAttribute('href'))
             .toBe('http://url/cdn/[realm-version]/img/test.png');
       })));
  });
});
