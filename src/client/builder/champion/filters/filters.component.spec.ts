import {TestBed} from '@angular/core/testing';

import {TestModule} from '../../../testing';

import {FiltersComponent} from './filters.component';

describe('FiltersComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [FiltersComponent], imports: [TestModule]});
  });
});
