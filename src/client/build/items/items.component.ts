import {Component, EventEmitter, Input, Output, ViewChildren, QueryList} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Item} from '../item';
import {Samples} from '../samples';

import {ItemSlotComponent} from './item-slot.component';

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
  @Input() pickedItems: Array<Item>;
  @Output() pickedItemsChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;

  addItemSlotComponent(slot: ItemSlotComponent) { this.children.toArray()[slot.id] = slot; }

  addItem(item: Item) { this.addToFirstCompatibleSlot(item); }

  private addToFirstCompatibleSlot(item: Item) {
    let s;
    this.children.toArray().forEach((slot: ItemSlotComponent) => {
      if (slot.compatible(item) && !s) {
        s = slot;
      }
    });
    s.addItem(item);
    this.updatePickedItems();
  }

  private updatePickedItems() {
    this.pickedItems = [];
    this.children.toArray().forEach((itemSlot) => {
      this.pickedItems = this.pickedItems.concat(itemSlot.getItems());
    });
    this.pickedItemsChange.emit(null);
  }
}
