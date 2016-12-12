import {TestBed} from '@angular/core/testing';

import {LolApiService} from '../../services/lolapi.service';
import {StatsService} from '../../services/stats.service';
import {TestModule} from '../../testing';

import {ItemSlotComponent} from './item-slot.component';
import {ItemsComponent} from './items.component';

describe('ItemSlotComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LolApiService, StatsService, ItemsComponent, ItemSlotComponent],
      imports: [TestModule]
    });
  });
});
