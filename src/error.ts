/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, Input, Output, NgIf, EventEmitter} from 'angular2/angular2';

@Component({
  selector: 'error'
})
@View({
  templateUrl: '/html/error.html',
  directives: [NgIf]
})

export class ErrorComponent {
  @Input() loading: boolean;
  @Input() ok: boolean;
  @Output() retry: EventEmitter = new EventEmitter();

  constructor() {
  }

  test()
  {
    this.retry.next(null);
  }
}