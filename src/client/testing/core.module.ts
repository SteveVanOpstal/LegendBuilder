import {ElementRef, NgModule} from '@angular/core';

import {MockElementRef} from './';

@NgModule({providers: [{provide: ElementRef, useValue: new MockElementRef()}]})
export class CoreModule {
}
