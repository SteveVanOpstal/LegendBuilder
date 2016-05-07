import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
  selector: 'bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [NgFor],
  template: `<div *ngFor="let val of repeat()"></div>`
})

export class BarComponent {
  @Input() value: number;
  private range: Array<any>;

  repeat() {
    this.range = new Array(this.value);
    return this.range;
  }
}
