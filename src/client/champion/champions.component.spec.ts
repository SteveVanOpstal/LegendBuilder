import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {LolApiService} from '../services/lolapi.service';
import {TestModule} from '../testing';

import {ChampionsComponent} from './champions.component';

describe('ChampionsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [ChampionsComponent, LolApiService], imports: [TestModule]});
  });

  it('should get champions',
     async(inject([MockBackend, ChampionsComponent], (backend, component) => {
       expect(component.champions).toHaveEqualContent({});
       component.ngOnInit();
       backend.success();
       expect(component.champions).not.toHaveEqualContent({});
       expect(component.error).toBeFalsy();
     })));

  it('should not get champions',
     async(inject([MockBackend, ChampionsComponent], (backend, component) => {
       expect(component.champions).toHaveEqualContent({});
       component.ngOnInit();
       backend.error();
       expect(component.champions).toHaveEqualContent({});
       expect(component.error).toBeTruthy();
     })));

  xit('should navigate when \'Enter\' is hit and one champion is available',
      inject([ChampionsComponent], (component) => {
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

  xit('should not navigate when \'Enter\' is hit and multiple champions are available',
      inject([ChampionsComponent], (component) => {
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
