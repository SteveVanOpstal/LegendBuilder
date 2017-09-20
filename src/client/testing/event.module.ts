import {NgModule} from '@angular/core';

import {MockEvent, MockKeyboardEvent} from './';

@NgModule({
  providers: [
    {provide: Event, useValue: new MockEvent()},
    {provide: KeyboardEvent, useValue: new MockKeyboardEvent()}
  ]
})
export class EventModule {}
