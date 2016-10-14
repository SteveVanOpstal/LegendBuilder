import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {LoginComponent} from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, SharedModule],
  exports: [LoginComponent]
})
export class LoginModule {
}
