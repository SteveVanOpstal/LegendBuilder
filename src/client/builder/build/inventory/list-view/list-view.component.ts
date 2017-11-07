import {Component, EventEmitter, Output} from '@angular/core';

import {Item} from '../../../../data/item';
import {BuildSandbox} from '../../build.sandbox';

@Component({
  selector: 'lb-list-view',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1500 300" stroke="#000" stroke-width="3">
      <ng-template ngFor let-item [ngForOf]="topLevelItems$ | async" let-i="index">
        <g lbItemContained [item]="item" [index]="i"></g>
      </ng-template>
    </svg>`
})

export class ListViewComponent {
  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  dragging = false;

  topLevelItems$ = this.sb.pickedItems$.map(items => {
    if (items) {
      return items.filter(item => !item.contained);
    }
  });

  constructor(public sb: BuildSandbox) {}
}
