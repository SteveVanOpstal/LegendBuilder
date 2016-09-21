import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {LoginComponent} from './login.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: []
})
export class LoginModule {
}
