import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../../shared/shared.module';

import {ItemComponent} from './item.component';
import {ItemsFromComponent} from './items-from.component';
import {PreviewComponent} from './preview.component';


@NgModule({
  declarations: [PreviewComponent, ItemsFromComponent, ItemComponent],
  imports: [CommonModule, SharedModule],
  exports: [PreviewComponent]
})
export class PreviewModule {
}
