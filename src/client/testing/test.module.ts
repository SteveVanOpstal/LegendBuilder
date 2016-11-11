import {NgModule} from '@angular/core';

import {LolApiService} from '../services/lolapi.service';
import {CoreModule, EventModule, HttpModule, RouterModule} from './';

@NgModule(
    {imports: [CoreModule, EventModule, HttpModule, RouterModule], providers: [LolApiService]})
export class TestModule {
}
