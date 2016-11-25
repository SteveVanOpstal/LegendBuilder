import {Component, QueryList, ViewChildren} from '@angular/core';

import {StatsService} from '../../services/stats.service';
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
  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;

  constructor(private stats: StatsService) {}

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
    let pickedItems = [];
    this.children.toArray().forEach((itemSlot) => {
      pickedItems = pickedItems.concat(itemSlot.getItems());
    });
    this.stats.pickedItems.next(pickedItems);
  }
}
