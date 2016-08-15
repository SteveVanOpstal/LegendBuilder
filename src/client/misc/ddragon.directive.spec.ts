import {ElementRef} from '@angular/core';
import {TestBed, async, inject} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute} from '@angular/router';

import {LolApiService} from '../misc/lolapi.service';
import {MockActivatedRoute, MockMockBackend} from '../testing';

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
    providers: [
      {provide: ElementRef, useValue: new elementRefType()},

      {provide: ActivatedRoute, useValue: new MockActivatedRoute()},

      BaseRequestOptions, {provide: MockBackend, useValue: new MockMockBackend()}, {
        provide: Http,
        useFactory: (backend, defaultOptions) => {
          return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      },

      LolApiService, DDragonDirective
    ]
  });
}

describe('DDragonDirective:style', () => {
  beforeEach(() => {
    addCommonProviders(MockImageElementRef);
  });

  beforeEach(inject([DDragonDirective], (directive) => {
    directive.x = 1;
    directive.y = 1;
  }));

  it('should initialise with a default image', inject([DDragonDirective], (directive) => {
       directive.ngOnInit();
       expect(directive.el.nativeElement.getAttribute('style')).toBe(directive.defaultImg);
     }));

  it('should set requested image',
     async(inject([MockBackend, DDragonDirective, LolApiService], (mockBackend, directive, service) => {
       mockBackend.subscribe(false, realm);
       directive.image = 'test.png';
       directive.ngOnInit();

       service.getRealm().subscribe(
           () => {
             expect(directive.el.nativeElement.getAttribute('style'))
                 .toBe(
                     'background:url(http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/test.png) 1px 1px;');
           },
           () => {
             fail('unexpected failure');
           });
     })));
});


describe('DDragonDirective:src', () => {
  beforeEach(() => {
    addCommonProviders(MockImageElementRef);
  });

  it('should initialise with a default image', inject([DDragonDirective], (directive) => {
       directive.ngOnInit();
       expect(directive.el.nativeElement.getAttribute('src')).toBe(directive.defaultImg);
     }));

  it('should set requested image',
     async(inject(
         [MockBackend, DDragonDirective, LolApiService], (mockBackend, directive, service) => {
           mockBackend.subscribe(false, realm);
           directive.image = 'test.png';
           directive.ngOnInit();

           service.getRealm().subscribe(
               () => {
                 expect(directive.el.nativeElement.getAttribute('src'))
                     .toBe('http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/test.png');
               },
               () => {
                 fail('unexpected failure');
               });
         })));
});


describe('DDragonDirective:xlink', () => {
  beforeEach(() => {
    addCommonProviders(MockSvgImageElementRef);
  });

  it('should initialise with a default image', inject([DDragonDirective], (directive) => {
       directive.ngOnInit();
       expect(directive.el.nativeElement.getAttributeNS('xlink:href')).toBe(directive.defaultImg);
     }));

  it('should set requested image',
     async(inject(
         [MockBackend, DDragonDirective, LolApiService], (mockBackend, directive, service) => {
           mockBackend.subscribe(false, realm);
           directive.image = 'test.png';
           directive.ngOnInit();

           service.getRealm().subscribe(
               () => {
                 expect(directive.el.nativeElement.getAttributeNS('xlink:href'))
                     .toBe('http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/test.png');
               },
               () => {
                 fail('unexpected failure');
               });
         })));
});


describe('DDragonDirective', () => {
  beforeEach(() => {
    addCommonProviders(MockImageElementRef);
  });

  it('should create a correct style string', inject([DDragonDirective], (directive) => {
       let result = directive.buildStyle('test.png', realm, 0, 0);
       expect(result).toBe(
           'background:url(http://ddragon.leagueoflegends.com/cdn/[realm-version]/img/test.png) 0px 0px;');
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

  it('should update image',
     async(inject(
         [MockBackend, DDragonDirective, LolApiService], (mockBackend, directive, service) => {
           mockBackend.subscribe(false, realm);
           spyOn(directive, 'setImage');
           expect(directive.setImage).not.toHaveBeenCalled();
           directive.ngOnInit();

           service.getRealm().subscribe(
               () => {
                 directive.ngOnChanges();
                 expect(directive.setImage).toHaveBeenCalled();
               },
               () => {
                 fail('unexpected failure');
               });
         })));
});
