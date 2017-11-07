import {Component, Input} from '@angular/core';

import {Item} from '../../../../data/item';


@Component({
  selector: 'g[lbItemContained]',
  template: `
    <ng-template [ngIf]="item.contains.length">
      <ng-template ngFor let-child [ngForOf]="item.contains" let-i="index">
        <g lbListViewItem [item]="child" [index]="i"></g>
      </ng-template>
    </ng-template>
    <g lbListViewItem [item]="item"></g>`
})

export class ItemContainedComponent {
  @Input() item: Item;
  @Input() index = 1;
}
