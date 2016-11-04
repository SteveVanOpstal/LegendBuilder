import {inject, TestBed} from '@angular/core/testing';

import {TestModule} from '../testing';

import {DataService} from './data.service';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [DataService], imports: [TestModule]});
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

  it('should be notified (subscribe, notify)', inject([DataService], (service) => {
       let trigger = jasmine.createSpy('trigger');
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.subscribe(trigger);
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.notify(item);
       expect(trigger).toHaveBeenCalledWith(item);
     }));

  it('should be notified (notify, subscribe)', inject([DataService], (service) => {
       let trigger = jasmine.createSpy('trigger');
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.notify(item);
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.subscribe(trigger);
       expect(trigger).toHaveBeenCalledWith(item);
     }));

  it('should be notified (multiple subscribers)', inject([DataService], (service) => {
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

  it('should not be notified', inject([DataService], (service) => {
       let trigger = jasmine.createSpy('trigger');
       expect(trigger).not.toHaveBeenCalled();
       service.pickedItems.subscribe(trigger);
       expect(trigger).not.toHaveBeenCalled();
     }));
});
