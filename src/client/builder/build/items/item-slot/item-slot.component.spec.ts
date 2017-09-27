import {TestBed} from '@angular/core/testing';

import {LolApiService, StatsService} from '../../../../services';
import {TestModule} from '../../../../testing';
import {ItemsComponent} from '../items.component';

import {ItemSlotComponent} from './item-slot.component';

describe('ItemSlotComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LolApiService, StatsService, ItemsComponent, ItemSlotComponent],
      imports: [TestModule]
    });
  });
});
