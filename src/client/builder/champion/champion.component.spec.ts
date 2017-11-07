import {TestBed} from '@angular/core/testing';

import {LolApiService} from '../../services/lolapi.service';
import {TestModule} from '../../testing';

import {ChampionComponent} from './champion.component';

describe('ChampionComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {providers: [ChampionComponent, LolApiService], imports: [TestModule]});
  });
});
