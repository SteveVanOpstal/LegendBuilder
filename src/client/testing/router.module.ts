import {NgModule} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {MockActivatedRoute, MockRouter} from './';

@NgModule({
  providers: [
    {provide: ActivatedRoute, useValue: new MockActivatedRoute()},
    {provide: Router, useValue: new MockRouter()}
  ]
})
export class RouterModule {
}
