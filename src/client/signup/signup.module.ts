import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {SignupComponent} from './signup.component';

@NgModule({
  declarations: [SignupComponent],
  imports: [CommonModule, SharedModule],
  exports: [SignupComponent]
})
export class SignupModule {
}
