import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AssetsModule} from '../../assets/assets.module';
import {SharedModule} from '../../shared/shared.module';

import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

@NgModule({
  declarations:
      [MasteriesComponent, MasteryCategoryComponent, MasteryTierComponent, MasteryComponent],
  imports: [CommonModule, AssetsModule, SharedModule],
  exports: [MasteriesComponent]
})
export class MasteriesModule {
}
