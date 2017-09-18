import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AboutComponent} from './about.component';
import {AboutRoutingModule} from './about.routing';

@NgModule({declarations: [AboutComponent], imports: [AboutRoutingModule, CommonModule]})
export class AboutModule {
}
