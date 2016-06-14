import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ItemSlotComponent} from './item-slot.component';
import {Item} from '../item';
import {Config} from '../config';

@Component({
  selector: 'items',
  directives: [ItemSlotComponent],
  template: `
    <item-slot [id]="0" [config]="config"></item-slot>
    <item-slot [id]="1" [config]="config"></item-slot>
    <item-slot [id]="2" [config]="config"></item-slot>
    <item-slot [id]="3" [config]="config"></item-slot>
    <item-slot [id]="4" [config]="config"></item-slot>
    <item-slot [id]="5" [config]="config"></item-slot>`
})

export class ItemsComponent {
  @Input() config: Config;
  // @Input() pickedItems: Array<Object>;
  // @Output() pickedItemsChange: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();

  private itemSlotComponents: Array<ItemSlotComponent> = [];

  addItemSlotComponent(slot: ItemSlotComponent) {
    this.itemSlotComponents[slot.id] = slot;
  }

  addItem(item: Item) {
    this.addToFirstCompatibleSlot(item);
  }

  private addToFirstCompatibleSlot(item: Item) {
    let s;
    this.itemSlotComponents.forEach((slot: ItemSlotComponent) => {
      if (slot.compatible(item) && !s) {
        s = slot;
      }
    });
    s.addItem(item);
    // this.updatePickedItems();
  }

  // private updatePickedItems() {
  //   this.pickedItems = [];
  //   this.itemSlotComponents.forEach((itemSlot) => {
  //     this.pickedItems = this.pickedItems.concat(itemSlot.getItems());
  //   });
  //   this.pickedItemsChange.emit(this.pickedItems);
  // }
}
