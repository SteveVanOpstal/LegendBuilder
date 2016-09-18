import {inject, TestBed} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute} from '@angular/router';

import {LolApiService} from '../../services/lolapi.service';
import {MockActivatedRoute, MockMockBackend} from '../../testing';

import {BuildService} from './build.service';


describe('BuildService', () => {
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

        LolApiService, BuildService
      ]
    });
  });

  let item = {
    id: 1,
    time: 1,
    from: [''],
    into: [''],
    bundle: 1,
    gold: {total: 1},
    image: {full: ''},
    tags: [''],
    stats: {}
  };

  it('should be notified (subscribe, notify)', inject([BuildService], (service) => {
       let trigger = jasmine.createSpy('trigger');
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.subscribe(trigger);
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.notify(item);
       expect(trigger).toHaveBeenCalledWith(item);
     }));

  it('should be notified (notify, subscribe)', inject([BuildService], (service) => {
       let trigger = jasmine.createSpy('trigger');
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.notify(item);
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.subscribe(trigger);
       expect(trigger).toHaveBeenCalledWith(item);
     }));

  it('should be notified (multiple subscribers)', inject([BuildService], (service) => {
       let trigger1 = jasmine.createSpy('trigger');
       let trigger2 = jasmine.createSpy('trigger');
       let trigger3 = jasmine.createSpy('trigger');
       expect(trigger1).not.toHaveBeenCalled();
       expect(trigger2).not.toHaveBeenCalled();
       expect(trigger3).not.toHaveBeenCalled();
       service.pickedItems.subscribe(trigger1);
       expect(trigger1).not.toHaveBeenCalled();
       service.pickedItems.subscribe(trigger2);
       expect(trigger2).not.toHaveBeenCalled();
       service.pickedItems.subscribe(trigger3);
       expect(trigger3).not.toHaveBeenCalled();
       service.pickedItems.notify(item);
       expect(trigger1).toHaveBeenCalledWith(item);
       expect(trigger2).toHaveBeenCalledWith(item);
       expect(trigger3).toHaveBeenCalledWith(item);
     }));

  it('should not be notified', inject([BuildService], (service) => {
       let trigger = jasmine.createSpy('trigger');
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.subscribe(trigger);
       expect(trigger).not.toHaveBeenCalled();
     }));
});
