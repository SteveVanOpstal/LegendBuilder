import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MainComponent} from './main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, RouterModule],
  exports: [MainComponent]
})
export class MainModule {}
