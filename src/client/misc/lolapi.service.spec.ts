import {addProviders, async, inject} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs';

import {LolApiService} from '../misc/lolapi.service';
import {MockActivatedRoute, MockMockBackend} from '../testing';

describe('LolApiService', () => {
  beforeEach(() => {
    addProviders([
      {provide: ActivatedRoute, useValue: new MockActivatedRoute()},

      BaseRequestOptions, {provide: MockBackend, useValue: new MockMockBackend()}, {
        provide: Http,
        useFactory: (backend, defaultOptions) => {
          return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      },

      LolApiService
    ]);
  });

  beforeEach(async(inject([MockBackend], (mockBackend) => {
    mockBackend.subscribe(false, {test: true});
  })));

  it('should get realm data', async(inject([LolApiService], (service) => {
       service.getRealm().subscribe(
           res => {
             expect(res).toBeDefined();
             expect(res.test).toBeTruthy();
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get regions', async(inject([LolApiService], (service) => {
       service.getRegions().subscribe(
           res => {
             expect(res).toBeDefined();
             expect(res[0].slug).toBe('euw');
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get champions', async(inject([LolApiService], (service) => {
       service.getChampions().subscribe(
           res => {
             expect(res).toBeDefined();
             expect(res.test).toBeTruthy();
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get champion', async(inject([LolApiService], (service) => {
       service.getChampion(0).subscribe(
           res => {
             expect(res).toBeDefined();
             expect(res.test).toBeTruthy();
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get items', async(inject([LolApiService], (service) => {
       service.getItems().subscribe(
           res => {
             expect(res).toBeDefined();
             expect(res.test).toBeTruthy();
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get masteries', async(inject([LolApiService], (service) => {
       service.getMasteries().subscribe(
           res => {
             expect(res).toBeDefined();
             expect(res.test).toBeTruthy();
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get summonerId', async(inject([LolApiService], (service) => {
       service.getSummonerId('', '').subscribe(
           res => {
             expect(res).toBeDefined();
             expect(res.test).toBeTruthy();
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get matchData', async(inject([LolApiService], (service) => {
       service.getMatchData(0, '', 0, 0)
           .subscribe(
               res => {
                 expect(res).toBeDefined();
                 expect(res.test).toBeTruthy();
               },
               () => {
                 fail('unexpected failure');
               });
     })));

  it('should handle a missing region',
     async(inject([ActivatedRoute, LolApiService], (route, service) => {
       route.params = Observable.create((observer) => {
         let params: Params = {'not region': ''};
         observer.next(params);
         observer.complete();
       });

       service.getRealm().subscribe(
           res => {
             fail('unexpected success');
           },
           (error) => {
             expect(error).not.toBeDefined();
           });
     })));

  it('should handle an incorrect region',
     async(inject([ActivatedRoute, LolApiService], (route, service) => {
       route.params = Observable.create((observer) => {
         let params: Params = {'region': 'not euw'};
         observer.next(params);
         observer.complete();
       });

       service.getRealm().subscribe(
           res => {
             fail('unexpected success');
           },
           (error) => {
             expect(error).not.toBeDefined();
           });
     })));

  it('should get the correct resolved link to the static-server',
     async(inject([LolApiService], (service) => {
       service.getUrl(region => service.linkStaticData(region))
           .subscribe(
               (urlResolved) => {
                 expect(urlResolved).toBe('http://localhost:8081/static-data/euw/v1.2');
               },
               () => {
                 fail('unexpected failure');
               });

       service.staticServer = {host: 'test', port: 5};
       service.getUrl(region => service.linkStaticData(region))
           .subscribe(
               (urlResolved) => {
                 expect(urlResolved).toBe('http://test:5/static-data/euw/v1.2');
               },
               () => {
                 fail('unexpected failure');
               });
     })));

  it('should get the correct resolved link to the match-server',
     async(inject([LolApiService], (service) => {
       service.getUrl(region => service.linkMatchData(region))
           .toPromise()
           .then((urlResolved) => {
             expect(urlResolved).toBe('http://localhost:8082/euw');
           })
           .catch(() => {
             fail('unexpected failure');
           });

       service.matchServer = {host: 'test', port: 5};
       service.getUrl(region => service.linkMatchData(region))
           .subscribe(
               (urlResolved) => {
                 expect(urlResolved).toBe('http://test:5/euw');
               },
               () => {
                 fail('unexpected failure');
               });
     })));
});
