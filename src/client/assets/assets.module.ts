import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {IconErrorComponent} from './icon-error.component';
import {IconEyeComponent} from './icon-eye.component';
import {IconLoadComponent} from './icon-load.component';
import {IconRefreshComponent} from './icon-refresh.component';

@NgModule({
  declarations: [IconErrorComponent, IconEyeComponent, IconLoadComponent, IconRefreshComponent],
  imports: [CommonModule],
  exports: [IconErrorComponent, IconEyeComponent, IconLoadComponent, IconRefreshComponent]
})
export class AssetsModule {}
