/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'config',
  templateUrl: '/html/build/config.component.html'
})

export class ConfigComponent {
  @Output() configChanged: EventEmitter = new EventEmitter();
  
  changed()
  {
    this.configChanged.next(null);
  }
}