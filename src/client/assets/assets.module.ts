import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {IconErrorComponent} from './icon-error.component';
import {IconEyeComponent} from './icon-eye.component';
import {IconLoadComponent} from './icon-load.component';
import {IconRankComponent} from './icon-rank.component';
import {IconRefreshComponent} from './icon-refresh.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    IconErrorComponent, IconEyeComponent, IconLoadComponent, IconRankComponent, IconRefreshComponent
  ],
  exports: [
    IconErrorComponent, IconEyeComponent, IconLoadComponent, IconRankComponent, IconRefreshComponent
  ],
  providers: []
})
export class AssetsModule {
}
