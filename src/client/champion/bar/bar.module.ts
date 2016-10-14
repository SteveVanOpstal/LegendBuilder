import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {BarComponent} from './bar.component';

@NgModule({declarations: [BarComponent], imports: [CommonModule], exports: [BarComponent]})
export class BarModule {
}
