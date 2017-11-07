import {async, inject, TestBed} from '@angular/core/testing';

import {LolApiService} from '../../../services/lolapi.service';
import {TestModule} from '../../../testing';
import {PickedItemsService} from '../services/picked-items.service';

xdescribe('PickedItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [PickedItemsService, LolApiService], imports: [TestModule]});
  });

  it('', async(inject([PickedItemsService], (service) => {
       service.add({id: '4095'});
       expect(service.encodeItems()).toBe('test');
     })));
});
