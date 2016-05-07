import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ItemSlotComponent} from './item-slot.component';
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

  private itemSlotComponents: Array<ItemSlotComponent> = [];

  addItemSlotComponent(slot: ItemSlotComponent) {
    this.itemSlotComponents[slot.id] = slot;
  }

  addItem(item: Object) {
    this.addToFirstCompatibleSlot(item);
  }

  private addToFirstCompatibleSlot(item: Object) {
    let s;
    this.itemSlotComponents.forEach((slot: ItemSlotComponent) => {
      if (slot.compatible(item) && !s) {
        s = slot;
      }
    });
    s.addItem(item);
  }

  // private MaxOwnableExceeded(pickedItems: Array<Object>, pickedItem: Object) {
  //   let pickedGroup = pickedItem['group'];
  //   if (!pickedGroup) {
  //     return false;
  //   }

  //   let pickedGroupCount = 0;
  //   pickedItems.forEach((item) => {
  //     if (item['group'] === pickedGroup) {
  //       pickedGroupCount++;
  //     }
  //   });

  //   let pickedGroupMaxOwnable = 0;
  //   this.items['groups'].forEach((group) => {
  //     if (pickedGroup.indexOf(group['key']) !== -1) {
  //       pickedGroupMaxOwnable = group['MaxGroupOwnable'];
  //     }
  //   });

  //   if (pickedGroupCount >= pickedGroupMaxOwnable && pickedGroupMaxOwnable >= 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
