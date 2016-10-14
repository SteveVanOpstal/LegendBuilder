import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {IconErrorComponent} from './icon-error.component';
import {IconEyeComponent} from './icon-eye.component';
import {IconLoadComponent} from './icon-load.component';
import {IconRankComponent} from './icon-rank.component';
import {IconRefreshComponent} from './icon-refresh.component';

@NgModule({
  declarations: [
    IconErrorComponent, IconEyeComponent, IconLoadComponent, IconRankComponent, IconRefreshComponent
  ],
  imports: [CommonModule],
  exports: [
    IconErrorComponent, IconEyeComponent, IconLoadComponent, IconRankComponent, IconRefreshComponent
  ]
})
export class AssetsModule {
}
