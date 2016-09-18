import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';

import {Item} from '../item';
import {BuildService} from '../services/build.service';

import {ItemSlotComponent} from './item-slot.component';

@Component({
  selector: 'items',
  template: `
    <item-slot [id]="0"></item-slot>
    <item-slot [id]="1"></item-slot>
    <item-slot [id]="2"></item-slot>
    <item-slot [id]="3"></item-slot>
    <item-slot [id]="4"></item-slot>
    <item-slot [id]="5"></item-slot>`
})

export class ItemsComponent {
  @Input() pickedItems: Array<Item>;
  @Output() pickedItemsChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;

  constructor(private build: BuildService) {}

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
    this.build.pickedItems.notify(this.pickedItems);
  }
}
