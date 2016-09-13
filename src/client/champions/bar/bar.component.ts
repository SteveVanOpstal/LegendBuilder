import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
