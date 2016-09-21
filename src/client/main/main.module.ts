import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MainComponent} from './main.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [MainComponent],
  exports: [MainComponent],
  providers: []
})
export class MainModule {
}
