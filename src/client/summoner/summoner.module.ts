import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SummonerComponent} from './summoner.component';

@NgModule(
    {declarations: [SummonerComponent], imports: [CommonModule], exports: [SummonerComponent]})
export class SummonerModule {
}
