import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute, Params} from '@angular/router';

import {settings} from '../../../config/settings';
import {LolApiService} from '../services/lolapi.service';
import {MockMockBackend, TestModule} from '../testing';

describe('LolApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: MockBackend, useValue: new MockMockBackend()},

        LolApiService
      ],
      imports: [TestModule]
    });
  });

  it('should get realm data', async(inject([LolApiService], (service) => {
       service.getRealm().subscribe(
           res => {
             expect(res).toBeDefined();
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
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get champion', async(inject([LolApiService], (service) => {
       service.getChampion(0).subscribe(
           res => {
             expect(res).toBeDefined();
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get items', async(inject([LolApiService], (service) => {
       service.getItems().subscribe(
           res => {
             expect(res).toBeDefined();
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get masteries', async(inject([LolApiService], (service) => {
       service.getMasteries().subscribe(
           res => {
             expect(res).toBeDefined();
           },
           () => {
             fail('unexpected failure');
           });
     })));

  it('should get summonerId', async(inject([LolApiService], (service) => {
       service.getSummonerId('', '').subscribe(
           res => {
             expect(res).toBeDefined();
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
                 expect(urlResolved)
                     .toBe(
                         'http://' + settings.staticServer.host + ':' + settings.staticServer.port +
                         '/static-data/euw/v1.2');
               },
               () => {
                 fail('unexpected failure');
               });
     })));

  it('should get the correct resolved link to the match-server',
     async(inject([LolApiService], (service) => {
       service.getUrl(region => service.linkMatchData(region))
           .subscribe(
               (urlResolved) => {
                 expect(urlResolved)
                     .toBe(
                         'http://' + settings.matchServer.host + ':' + settings.matchServer.port +
                         '/euw');
               },
               () => {
                 fail('unexpected failure');
               });
     })));
});
