import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {AssetsModule} from '../../assets/assets.module';
import {SharedModule} from '../../shared/shared.module';

import {SummonerComponent} from './summoner.component';
import {SummonerSandbox} from './summoner.sandbox';


@NgModule({
  providers: [SummonerSandbox],
  declarations: [SummonerComponent],
  imports: [CommonModule, ReactiveFormsModule, AssetsModule, SharedModule],
  exports: [SummonerComponent]
})
export class SummonerModule {}
