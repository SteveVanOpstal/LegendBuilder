import {async, inject, TestBed} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services/lolapi.service';
import {MockActivatedRoute, MockMockBackend, MockRouter} from '../testing';

import {ChampionComponent} from './champion.component';

describe('ChampionComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ActivatedRoute, useValue: new MockActivatedRoute()},

        BaseRequestOptions, {provide: MockBackend, useValue: new MockMockBackend()}, {
          provide: Http,
          useFactory: (backend, defaultOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },

        {provide: Router, useValue: new MockRouter()},

        LolApiService, ChampionComponent
      ]
    });
  });

  it('should call getData() on contruct', inject([ChampionComponent], (component) => {
       spyOn(component, 'getData');
       expect(component.getData).not.toHaveBeenCalled();
       component.ngOnInit();
       expect(component.getData).toHaveBeenCalled();
     }));

  it('should get champions',
     async(inject(
         [MockBackend, ChampionComponent, LolApiService], (mockBackend, component, service) => {
           mockBackend.subscribe(false, {});

           expect(component.champions).not.toBeDefined();
           component.getData();
           return service.getChampions().subscribe(
               () => {
                 expect(component.champions).toBeDefined();
               },
               () => {
                 fail('unexpected failure');
               });
         })));

  it('should not get champions',
     async(inject(
         [MockBackend, ChampionComponent, LolApiService], (mockBackend, component, service) => {
           mockBackend.subscribe();

           expect(component.champions).not.toBeDefined();
           component.getData();
           return service.getChampions().subscribe(
               () => {
                 fail('unexpected success');
               },
               () => {
                 expect(component.champions).not.toBeDefined();
                 expect(component.error).toBeTruthy();
               });
         })));

  it('should navigate when \'Enter\' is hit and one champion is available',
     inject([ChampionComponent], (component) => {
       spyOn(component.router, 'navigate').and.callFake(() => {
         return {
           catch: (callback) => {
             return callback();
           }
         };
       });
       expect(component.router.navigate).not.toHaveBeenCalled();
       component.champions = {
         data: [{
           key: 'Aatrox',
           name: 'Aatrox',
           tags: ['Fighter', 'Tank'],
           info: {'defense': 4, 'magic': 3, 'difficulty': 4, 'attack': 8}
         }]
       };
       component.enterHit();
       expect(component.router.navigate).toHaveBeenCalled();
     }));

  it('should not navigate when \'Enter\' is hit and multiple champions are available',
     inject([ChampionComponent], (component) => {
       spyOn(component.router, 'navigate').and.callFake(() => {
         return {
           catch: (callback) => {
             return callback();
           }
         };
       });
       expect(component.router.navigate).not.toHaveBeenCalled();
       component.champions = {
         data: [
           {
             key: 'Aatrox',
             name: 'Aatrox',
             tags: ['Fighter', 'Tank'],
             info: {defense: 4, magic: 3, difficulty: 4, attack: 8}
           },
           {
             key: 'Thresh',
             name: 'Aatrox',
             tags: ['Fighter', 'Support'],
             info: {defense: 6, magic: 6, difficulty: 7, attack: 5}
           }
         ]
       };
       component.enterHit();
       expect(component.router.navigate).not.toHaveBeenCalled();
     }));
});
