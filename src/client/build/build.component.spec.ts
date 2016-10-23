import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {BuildService} from '../services/build.service';
import {LolApiService} from '../services/lolapi.service';
import {StatsService} from '../services/stats.service';
import {MockMockBackend, TestModule} from '../testing';

import {BuildComponent} from './build.component';

describe('BuildComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: MockBackend, useValue: new MockMockBackend()},

        LolApiService, StatsService, BuildService, BuildComponent
      ],
      imports: [TestModule]
    });
  });


  it('should be initialised', inject([BuildComponent], (component) => {
       component.ngOnInit();
       expect(component.championKey).toBe('VelKoz');
       expect(component.champion).not.toBeDefined();
       expect(component.loading).toBeTruthy();
       expect(component.error).toBeFalsy();
     }));

  it('should call getData() onInit', inject([BuildComponent], (component) => {
       spyOn(component, 'getData');
       expect(component.getData).not.toHaveBeenCalled();
       component.ngOnInit();
       expect(component.getData).toHaveBeenCalled();
     }));

  it('should call getMatchData() onInit', inject([BuildComponent], (component) => {
       spyOn(component, 'getMatchData');
       expect(component.getMatchData).not.toHaveBeenCalled();
       component.ngOnInit();
       expect(component.getMatchData).toHaveBeenCalled();
     }));

  it('should handle a champion request',
     async(
         inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
           mockBackend.success();

           expect(component.champion).not.toBeDefined();
           component.getData();
           return service.getChampion('VelKoz').subscribe(
               () => {
                 expect(component.champion).toBeDefined();
               },
               () => {
                 fail('unexpected failure');
               });
         })));

  it('should handle a champion error',
     async(
         inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
           mockBackend.error();

           expect(component.champion).not.toBeDefined();
           component.getData();
           return service.getChampion('VelKoz').subscribe(
               () => {
                 fail('unexpected success');
               },
               () => {
                 expect(component.champion).not.toBeDefined();
                 expect(component.error).toBeTruthy();
               });
         })));

  it('should handle a match request',
     async(
         inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
           let samples = {xp: [0, 1], gold: [0, 1]};
           mockBackend.success(samples);

           component.getMatchData('');
           return service.getMatchData('', '', 0, 0)
               .subscribe(
                   () => {
                     component.build.samples.subscribe((result) => {
                       expect(result).toHaveEqualContent(samples);
                     });
                   },
                   () => {
                     fail('unexpected failure');
                   });
         })));

  it('should handle a match error',
     async(
         inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
           component.getMatchData('');
           return service.getMatchData('', '', 0, 0)
               .subscribe(
                   () => {
                     fail('unexpected success');
                   },
                   () => {
                     component.build.samples.subscribe(() => {
                       expect(component.error).toBeTruthy();
                     });
                   });
         })));
});
