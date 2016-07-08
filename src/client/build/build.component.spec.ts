import {provide} from '@angular/core';
import {addProviders, async, iit, inject, it} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../misc/lolapi.service';
import {MockActivatedRoute, MockMockBackend} from '../testing';

import {BuildComponent} from './build.component';

describe('BuildComponent', () => {
  beforeEach(() => {
    addProviders([
      {provide: ActivatedRoute, useValue: new MockActivatedRoute()},

      BaseRequestOptions, {provide: MockBackend, useValue: new MockMockBackend()}, {
        provide: Http,
        useFactory: function(backend, defaultOptions) {
          return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      },

      LolApiService, BuildComponent
    ]);
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
           mockBackend.subscribe(false, {});

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
           mockBackend.subscribe();

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
           mockBackend.subscribe(false, samples);

           expect(component.samples).toBeDefined();
           component.getMatchData('');
           return service.getMatchData('', '', 0, 0)
               .subscribe(
                   () => {
                     expect(component.samples).toHaveEqualContent(samples);
                   },
                   () => {
                     fail('unexpected failure');
                   });
         })));

  it('should handle a match error',
     async(
         inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
           let samples = {xp: [0, 1], gold: [0, 1]};
           mockBackend.subscribe();

           expect(component.samples).toBeDefined();
           component.getMatchData('');
           return service.getMatchData('', '', 0, 0)
               .subscribe(
                   () => {
                     fail('unexpected success');
                   },
                   () => {
                     expect(component.samples).not.toHaveEqualContent(samples);
                     expect(component.error).toBeTruthy();
                   });
         })));
});
