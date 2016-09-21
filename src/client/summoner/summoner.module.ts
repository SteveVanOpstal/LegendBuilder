import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SummonerComponent} from './summoner.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SummonerComponent],
  exports: [SummonerComponent],
  providers: []
})
export class SummonerModule {
}
