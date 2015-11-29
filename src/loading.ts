/// <reference path="typings/angular2/angular2.d.ts" />

import {Directive, View, NgIf} from 'angular2/angular2';

@Directive({
  selector: 'loading',
  inputs: [
    'loading: loading',
    'error: error'
  ]
})
@View({
  template: '\
      <img *ng-if="loading" class="icon-load" src="images/icons/loading-spin.svg" />\
      <img *ng-if="error" class="icon-error" src="images/icons/warning.svg" />\
      ',
  directives: [NgIf]
})

export class Loading {
  loading: boolean;
  error: boolean;

  constructor() {
    this.loading = true;
    this.error = false;
  }
}