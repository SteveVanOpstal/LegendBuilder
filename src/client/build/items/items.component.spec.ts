import {inject, TestBed} from '@angular/core/testing';

import {StatsService} from '../../services/stats.service';
import {ItemsComponent} from './items.component';

describe('ItemsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ItemsComponent, StatsService]});
  });

  beforeEach(inject([ItemsComponent], (component) => {
    component.samples = {gold: [100, 200, 300], gameTime: 200, sampleSize: 20};
    component.itemSlotComponents = [
      {'id': 3341, 'gold': {'total': 0}}, {'id': 2003, 'gold': {'total': 50}},
      {'id': 2003, 'gold': {'total': 50}}, {'id': 2003, 'gold': {'total': 50}}
    ];
  }));
});
