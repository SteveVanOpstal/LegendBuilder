import {NgModule} from '@angular/core';

import {CoreModule, EventModule, HttpModule, RouterModule} from './';

@NgModule({imports: [CoreModule, EventModule, HttpModule, RouterModule]})
export class TestModule {}
