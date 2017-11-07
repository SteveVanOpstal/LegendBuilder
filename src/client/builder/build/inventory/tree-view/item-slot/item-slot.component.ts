import {Component, EventEmitter, Output} from '@angular/core';
import {QueryList, ViewChildren} from '@angular/core';

import {Item} from '../../../../../data/item';
import {ItemComponent} from '../../shared/item/item.component';

@Component({
  selector: 'g[lbItemSlot]',
  styleUrls: ['./item-slot.component.scss'],
  template: `
    <svg:g class="item" *ngFor="let item of items">
      <g lbItem [attr.transform]="'translate(' + item.offset + ',0)'"
              [item]="item"
              [ngClass]="{disabled: item.disabled}"
              (click)="itemSelected.emit(item)"
              (contextmenu)="rightClicked(item)"
              (dragstart)="itemDragStart.emit(item)"
              (dragend)="itemDragEnd.emit(null)"
              draggable>
      </g>
    </svg:g>`
})

export class ItemSlotComponent {
  @ViewChildren(ItemComponent) children: QueryList<ItemComponent>;

  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemRemoved: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDragStart: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDragEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemDrop: EventEmitter<Item> = new EventEmitter<Item>();
  items = Array<Item>();

  rightClicked(item: Item): boolean {
    this.itemRemoved.emit(item);
    return false;  // stop context menu from appearing
  }

  lastItem() {
    return this.items[this.items.length - 1];
  }
}
