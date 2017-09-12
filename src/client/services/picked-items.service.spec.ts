import {async, inject, TestBed} from '@angular/core/testing';

import {LolApiService, PickedItemsService} from '../services';
import {TestModule} from '../testing';

describe('PickedItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [PickedItemsService, LolApiService], imports: [TestModule]});
  });

  it('', async(inject([PickedItemsService], (service) => {
       service.add({id: '4095'});
       expect(service.encodeItems()).toBe('test');
     })));
});
