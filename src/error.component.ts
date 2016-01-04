/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {NgIf} from 'angular2/common';

@Component({
  selector: 'error',
  templateUrl: '/html/error.component.html',
  directives: [NgIf]
})

export class ErrorComponent {
  @Input() loading: boolean;
  @Input() ok: boolean;
  @Output() retry: EventEmitter = new EventEmitter();

  constructor() {
  }

  retryClicked()
  {
    this.retry.next(null);
  }
}