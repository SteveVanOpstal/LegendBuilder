import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ItemSlotComponent} from './item-slot.component';
import {Item} from '../../misc/item';
import {Samples} from '../samples';

@Component({
  selector: 'items',
  directives: [ItemSlotComponent],
  template: `
    <item-slot [id]="0" [samples]="samples"></item-slot>
    <item-slot [id]="1" [samples]="samples"></item-slot>
    <item-slot [id]="2" [samples]="samples"></item-slot>
    <item-slot [id]="3" [samples]="samples"></item-slot>
    <item-slot [id]="4" [samples]="samples"></item-slot>
    <item-slot [id]="5" [samples]="samples"></item-slot>`
})

export class ItemsComponent {
  @Input() samples: Samples;
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
