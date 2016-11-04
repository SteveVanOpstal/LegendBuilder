import {ElementRef} from '@angular/core';
import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {LolApiService} from '../services/lolapi.service';
import {TestModule} from '../testing';

import {DDragonDirective} from './ddragon.directive';

class MockNativeElement {
  private attributes: Array<string> = new Array<string>();
  private attributesNS: Array<string> = new Array<string>();

  constructor(private tagName: string) {}

  setAttribute(attr: string, value: string): number {
    this.attributes[attr] = value;
    return this.attributes.length;
  }
  getAttribute(attr: string): Object {
    return this.attributes[attr];
  }

  setAttributeNS(scope: string, attr: string, value: string): number {
    this.attributesNS[attr] = value;
    return this.attributesNS.length;
  }
  getAttributeNS(attr: string): Object {
    return this.attributesNS[attr];
  }
}

class MockImageElementRef implements ElementRef {
  nativeElement: MockNativeElement = new MockNativeElement('IMG');
}
class MockSvgImageElementRef implements ElementRef {
  nativeElement: MockNativeElement = new MockNativeElement('IMAGE');
}


let realm = {
  'v': '[realm-version]',
  'cdn': 'http://ddragon.leagueoflegends.com/cdn',
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


function addCommonProviders<T>(elementRefType: {new (): T}) {
  TestBed.configureTestingModule({
    providers: [{provide: ElementRef, useValue: new elementRefType()}, DDragonDirective],
    imports: [TestModule]
  });
}

xdescribe('DDragonDirective:style', () => {
  beforeEach(() => {
    addCommonProviders(MockImageElementRef);
  });

  beforeEach(inject([DDragonDirective], (directive) => {
    directive.x = 1;
    directive.y = 1;
  }));

  it('should initialise with a default image',
     inject([MockBackend, DDragonDirective, LolApiService], (backend, directive, service) => {
       directive.ngOnInit();
       backend.success(realm);
       expect(directive.el.nativeElement.getAttribute('style')).toBe(directive.defaultImg);
     }));

  it('should set requested image',
     async(inject([MockBackend, DDragonDirective], (backend, directive) => {
       directive.image = 'test.png';
       directive.ngOnInit();
       backend.success(realm);
       expect(directive.el.nativeElement.getAttribute('style'))
           .toBe(
               'background:url(http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/test.png)\
 1px 1px;');
     })));
});

xdescribe('DDragonDirective:src', () => {
  beforeEach(() => {
    addCommonProviders(MockImageElementRef);
  });

  it('should initialise with a default image',
     inject([MockBackend, DDragonDirective], (backend, directive) => {
       directive.ngOnInit();
       backend.success(realm);
       expect(directive.el.nativeElement.getAttribute('src')).toBe(directive.defaultImg);
     }));

  it('should set requested image',
     async(inject([MockBackend, DDragonDirective], (backend, directive) => {
       directive.image = 'test.png';
       directive.ngOnInit();
       backend.success(realm);
       expect(directive.el.nativeElement.getAttribute('src'))
           .toBe('http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/test.png');
     })));
});

xdescribe('DDragonDirective:xlink', () => {
  beforeEach(() => {
    addCommonProviders(MockSvgImageElementRef);
  });

  it('should initialise with a default image',
     inject([MockBackend, DDragonDirective], (backend, directive) => {
       directive.ngOnInit();
       backend.success(realm);
       expect(directive.el.nativeElement.getAttributeNS('xlink:href')).toBe(directive.defaultImg);
     }));

  it('should set requested image',
     async(inject([MockBackend, DDragonDirective], (backend, directive) => {
       directive.image = 'test.png';
       directive.ngOnInit();
       backend.success(realm);
       expect(directive.el.nativeElement.getAttributeNS('xlink:href'))
           .toBe('http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/test.png');
     })));
});


describe('DDragonDirective', () => {
  beforeEach(() => {
    addCommonProviders(MockImageElementRef);
  });

  it('should create a correct style string', inject([DDragonDirective], (directive) => {
       let result = directive.buildStyle('test.png', realm, 0, 0);
       expect(result).toBe(
           'background:url(http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/test.png)\
 0px 0px;');
     }));

  it('should use a default url when image or realm is unavailable',
     inject([DDragonDirective], (directive) => {
       let result = directive.buildUrl('test.png', undefined);
       expect(result).toBeDefined();
       result = directive.buildUrl('test.png', undefined);
       expect(result).toBeDefined();
     }));

  it('should create a correct url', inject([DDragonDirective], (directive) => {
       let result = directive.buildUrl('test.png', realm);
       expect(result).toBe('http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/test.png');
     }));

  it('should create a correct \'ui\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildUrl('ui/test.png', realm);
       expect(result).toBe('http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/test.png');
     }));

  it('should create a correct \'champion\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildUrl('champion/test.png', realm);
       expect(result).toBe(
           'http://ddragon.leagueoflegends.com/cdn/[champion-version]/img/champion/test.png');
     }));

  it('should create a correct \'profileicon\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildUrl('profileicon/test.png', realm);
       expect(result).toBe(
           'http://ddragon.leagueoflegends.com/cdn/[profileicon-version]/img/profileicon/test.png');
     }));

  it('should create a correct \'junk\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildUrl('junk/test.png', realm);
       expect(result).toBe(
           'http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/junk/test.png');
     }));

  it('should create a correct \'champion/loading\' url', inject([DDragonDirective], (directive) => {
       let result = directive.buildUrl('champion/loading/test.png', realm);
       expect(result).toBe('http://ddragon.leagueoflegends.com/cdn/img/champion/loading/test.png');
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
});
