/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {NgFor} from 'angular2/common';

@Component({
  selector: 'bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [NgFor],
  template: `<div *ngFor="#val of repeat()"></div>`
})

export class BarComponent {
  @Input() value: number;
  private range: Array<any>;

  repeat() {
    this.range = new Array(this.value);
    return this.range;
  }
}