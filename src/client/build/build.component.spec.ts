import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {DataService} from '../services/data.service';
import {LolApiService} from '../services/lolapi.service';
import {StatsService} from '../services/stats.service';
import {TestModule} from '../testing';

import {BuildComponent} from './build.component';

describe('BuildComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuildComponent, StatsService, DataService, LolApiService],
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
     async(inject([MockBackend, BuildComponent], (backend, component) => {
       expect(component.champion).not.toBeDefined();
       component.getData();
       backend.success();
       expect(component.champion).toBeDefined();
     })));

  it('should handle a champion error',
     async(inject([MockBackend, BuildComponent], (backend, component) => {
       expect(component.champion).not.toBeDefined();
       component.getData();
       backend.error();
       expect(component.champion).not.toBeDefined();
       expect(component.error).toBeTruthy();
     })));

  it('should handle a match request',
     async(inject([MockBackend, BuildComponent], (backend, component) => {
       let samples = {xp: [0, 1], gold: [0, 1]};
       component.getMatchData('');
       backend.success(samples);
       component.data.samples.subscribe((result) => {
         expect(result).toHaveEqualContent(samples);
       });
     })));

  it('should handle a match error',
     async(inject([MockBackend, BuildComponent], (backend, component) => {
       component.getMatchData('');
       backend.error();
       component.data.samples.subscribe(() => {
         expect(component.error).toBeTruthy();
       });
     })));
});
