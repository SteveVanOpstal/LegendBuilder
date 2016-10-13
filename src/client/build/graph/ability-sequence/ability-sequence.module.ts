import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../../shared/shared.module';

import {AbilitySequenceComponent} from './ability-sequence.component';

@NgModule({
  declarations: [AbilitySequenceComponent],
  imports: [CommonModule, SharedModule],
  exports: [AbilitySequenceComponent]
})
export class AbilitySequenceModule {
}
