import {async, inject, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';

import {settings} from '../../../config/settings';
import {LolApiService} from '../services/lolapi.service';
import {TestModule} from '../testing';

describe('LolApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [TestModule]});
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

  it('should handle an incorrect region',
     async(inject([Router, LolApiService], (router, service) => {
       router.setRegion('not a region');

       service.getRealm().subscribe(
           res => {
             fail('unexpected success');
           },
           (error) => {
             expect(error).not.toBeDefined();
           });
     })));

  it('should get the correct resolved link to the static-server',
     inject([LolApiService], (service) => {
       expect(service.linkStaticData('region'))
           .toBe(
               'http://' + settings.staticServer.host + ':' + settings.staticServer.port +
               '/static-data/region/v1.2');
     }));

  it('should get the correct resolved link to the match-server',
     inject([LolApiService], (service) => {
       expect(service.linkMatchData('region'))
           .toBe(
               'http://' + settings.matchServer.host + ':' + settings.matchServer.port + '/region');
     }));
});
