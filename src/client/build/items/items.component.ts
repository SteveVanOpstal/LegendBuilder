import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';

import {DataService} from '../../services/data.service';
import {Item} from '../item';

import {ItemSlotComponent} from './item-slot.component';

@Component({
  selector: 'lb-items',
  template: `
    <lb-item-slot [id]="0"></lb-item-slot>
    <lb-item-slot [id]="1"></lb-item-slot>
    <lb-item-slot [id]="2"></lb-item-slot>
    <lb-item-slot [id]="3"></lb-item-slot>
    <lb-item-slot [id]="4"></lb-item-slot>
    <lb-item-slot [id]="5"></lb-item-slot>`
})

export class ItemsComponent {
  @Input() pickedItems: Array<Item>;
  @Output() pickedItemsChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;

  constructor(private data: DataService) {}

  addItemSlotComponent(slot: ItemSlotComponent) {
    this.children.toArray()[slot.id] = slot;
  }

  addItem(item: Item) {
    this.addToFirstCompatibleSlot(item);
  }

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
    this.data.pickedItems.notify(this.pickedItems);
  }
}
