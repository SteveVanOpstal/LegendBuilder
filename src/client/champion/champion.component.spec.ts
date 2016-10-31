import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {TestModule} from '../testing';

import {ChampionComponent} from './champion.component';


describe('ChampionComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ChampionComponent], imports: [TestModule]});
  });

  it('should call getData() on contruct', inject([ChampionComponent], (component) => {
       spyOn(component, 'getData');
       expect(component.getData).not.toHaveBeenCalled();
       component.ngOnInit();
       expect(component.getData).toHaveBeenCalled();
     }));

  it('should get champions',
     async(inject([MockBackend, ChampionComponent], (backend, component) => {
       expect(component.champions).not.toBeDefined();
       component.getData();
       backend.success();
       expect(component.champions).toBeDefined();
       expect(component.error).toBeFalsy();
     })));

  it('should not get champions',
     async(inject([MockBackend, ChampionComponent], (backend, component) => {
       expect(component.champions).not.toBeDefined();
       component.getData();
       backend.error();
       expect(component.champions).not.toBeDefined();
       expect(component.error).toBeTruthy();
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
