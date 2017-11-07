import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Item} from '../../../../data/item';
import {BuildSandbox} from '../../build.sandbox';

@Component({
  selector: 'g[lbListViewItem]',
  template: `
    <svg:g transform="translate(0,0)">
      <line [attr.x1]="item.offset" y1="0" [attr.x2]="index * 80" y2="40"/>
    </svg:g>
    <svg:g lbItem [attr.transform]="'translate(' + index * 80 + ',0)'"
            [item]="item"
            [ngClass]="{disabled: item.disabled}"
            (click)="itemSelected.emit(item)"
            (contextmenu)="sb.removePickedItem($event)"
            (dragstart)="dragging=true"
            (dragend)="dragging=false"
            draggable>
    </svg:g>
    <svg:g [attr.transform]="'translate(' + ((index * 80) + 60) + ',18)'">
      <line x1="0" y1="0" x2="7" y2="7"/>
      <line x1="0" y1="12" x2="7" y2="5"/>
    </svg:g>`
})

export class ListViewItemComponent {
  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  dragging = false;
  @Input() item: Item;
  @Input() index = 1;

  constructor(public sb: BuildSandbox) {}
}
