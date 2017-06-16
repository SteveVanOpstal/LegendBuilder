import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {LolApiService, StatsService} from '../services';
import {TestModule} from '../testing';

import {BuildComponent} from './build.component';

describe('BuildComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [BuildComponent, StatsService, LolApiService], imports: [TestModule]});
  });

  xit('should handle a champion request',
      async(inject([MockBackend, BuildComponent], (backend, component) => {
        expect(component.champion).not.toBeDefined();
        component.ngOnInit();
        backend.success();
        expect(component.champion).toBeDefined();
      })));

  xit('should handle a champion error',
      async(inject([MockBackend, BuildComponent], (backend, component) => {
        expect(component.champion).not.toBeDefined();
        component.ngOnInit();
        backend.error();
        expect(component.champion).not.toBeDefined();
        expect(component.error).toBeTruthy();
      })));
});
