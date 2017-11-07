import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {IconErrorComponent} from './icon-error.component';
import {IconEyeComponent} from './icon-eye.component';
import {IconListComponent} from './icon-list.component';
import {IconLoadComponent} from './icon-load.component';
import {IconRefreshComponent} from './icon-refresh.component';
import {IconTreeComponent} from './icon-tree.component';

@NgModule({
  declarations: [
    IconErrorComponent, IconEyeComponent, IconLoadComponent, IconRefreshComponent,
    IconListComponent, IconTreeComponent
  ],
  imports: [CommonModule],
  exports: [
    IconErrorComponent, IconEyeComponent, IconLoadComponent, IconRefreshComponent,
    IconListComponent, IconTreeComponent
  ]
})
export class AssetsModule {}
