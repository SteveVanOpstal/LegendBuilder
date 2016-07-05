import {provide} from '@angular/core';
import {addProviders, async, iit, inject, it} from '@angular/core/testing';
import {BaseRequestOptions, Http, Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../misc/lolapi.service';
import {MockActivatedRoute} from '../testing';

import {BuildComponent} from './build.component';

describe('BuildComponent', () => {
  beforeEach(() => {
    addProviders([
      {provide: ActivatedRoute, useValue: new MockActivatedRoute()},

      BaseRequestOptions, MockBackend, {
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
           let mockResponse = new Response(new ResponseOptions({status: 200, body: [{}]}));
           mockBackend.connections.subscribe((connection: MockConnection) => {
             connection.mockRespond(mockResponse);
           });

           expect(component.champion).not.toBeDefined();
           component.getData();
           return service.getChampion('VelKoz')
               .toPromise()
               .then(() => {
                 expect(component.champion).toBeDefined();
               })
               .catch(() => {
                 expect(false).toBeTruthy();
               });
         })));

  it('should handle a champion error',
     async(
         inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
           mockBackend.connections.subscribe((connection: MockConnection) => {
             connection.mockError();
           });

           expect(component.champion).not.toBeDefined();
           component.getData();
           return service.getChampion('VelKoz')
               .toPromise()
               .then(() => {
                 expect(false).toBeTruthy();
               })
               .catch(() => {
                 expect(component.champion).not.toBeDefined();
                 expect(component.error).toBeTruthy();
               });
         })));

  it('should handle a match request',
     async(
         inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
           let samples = {xp: [0, 1], gold: [0, 1]};
           let mockResponse =
               new Response(new ResponseOptions({status: 200, body: {xp: [0, 1], gold: [0, 1]}}));
           mockBackend.connections.subscribe((connection: MockConnection) => {
             connection.mockRespond(mockResponse);
           });

           expect(component.samples).toBeDefined();
           component.getMatchData('');
           return service.getMatchData('', '', 0, 0)
               .toPromise()
               .then(() => {
                 expect(component.samples).toHaveEqualContent(samples);
               })
               .catch(() => {
                 expect(false).toBeTruthy();
               });
         })));

  it('should handle a match error',
     async(
         inject([MockBackend, BuildComponent, LolApiService], (mockBackend, component, service) => {
           let samples = {xp: [0, 1], gold: [0, 1]};
           mockBackend.connections.subscribe((connection: MockConnection) => {
             connection.mockError();
           });

           expect(component.samples).toBeDefined();
           component.getMatchData('');
           return service.getMatchData('', '', 0, 0)
               .toPromise()
               .then(() => {
                 expect(false).toBeTruthy();
               })
               .catch(() => {
                 expect(component.samples).not.toHaveEqualContent(samples);
                 expect(component.error).toBeTruthy();
               });
         })));
});
