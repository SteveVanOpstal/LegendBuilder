import {TestBed} from '@angular/core/testing';

import {LolApiService} from '../../../../../services/lolapi.service';
import {TestModule} from '../../../../../testing';
import {StatsService} from '../../../services/stats.service';
import {InventoryComponent} from '../../inventory.component';

import {ItemSlotComponent} from './item-slot.component';

describe('ItemSlotComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LolApiService, StatsService, InventoryComponent, ItemSlotComponent],
      imports: [TestModule]
    });
  });
});
