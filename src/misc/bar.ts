/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, Input, NgFor, ChangeDetectionStrategy} from 'angular2/angular2';

@Component({
  selector: 'bar'
})
@View({
    template: '<div *ng-for="#val of repeat()"></div>',
    directives: [NgFor]
})

export class BarComponent {
  @Input() value: number;
  
  constructor() {
  }
  
  private repeat()
  {
    return new Array(this.value);
  }
}