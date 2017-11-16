import {Component, Input} from '@angular/core';

import {Item} from '../../../../../models/item';

@Component({
  selector: 'g[lbItemCurve]',
  template: `
    <ng-template [ngIf]="item.contains.length">
      <ng-template ngFor let-child [ngForOf]="item.contains">
        <svg:g lbCurve [start]="{x: child.offset + 28, y: 24 + (child.slotId * 50)}"
                  [end]="{x: item.offset + 20, y: 24 + (item.slotId * 50)}">
        </svg:g>
      </ng-template>
      <ng-template ngFor let-child [ngForOf]="item.contains">
        <svg:g class="child" lbItemCurve [item]="child"></svg:g>
      </ng-template>
    </ng-template>`
})

export class ItemCurveComponent {
  @Input() item: Item;

  constructor() {}
}
