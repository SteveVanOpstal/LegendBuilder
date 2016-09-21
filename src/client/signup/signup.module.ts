import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {SignupComponent} from './signup.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [SignupComponent],
  exports: [SignupComponent],
  providers: []
})
export class SignupModule {
}
