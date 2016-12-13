import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Item} from '../../item';

@Component({
  selector: 'lb-item',
  template: `
    <img [lbDDragon]="'item/' + item?.image?.full"
         (click)="selectItem(item)"
         (contextmenu)="pickItem(item)">
    <p class="gold" (click)="selectItem(item)" (contextmenu)="pickItem(item)">
      {{item?.gold?.total ? item?.gold?.total : ''}}
    </p>`
})

export class ItemComponent {
  @Input() item: Item;
  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemPicked: EventEmitter<Item> = new EventEmitter<Item>();

  selectItem(item: Item) {
    this.itemSelected.emit(item);
  }

  pickItem(item: Item) {
    this.itemPicked.emit(item);
    return false;  // stop context menu from appearing
  }
}
