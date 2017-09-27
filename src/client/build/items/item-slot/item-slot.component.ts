import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {QueryList, ViewChildren} from '@angular/core';

import {Item} from '../../../data/item';
import {ReactiveComponent} from '../../../shared/reactive.component';
import {BuildSandbox} from '../../build.sandbox';
import {ItemComponent} from '../item/item.component';

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

export class ItemSlotComponent extends ReactiveComponent implements OnInit {
  @ViewChildren(ItemComponent) children: QueryList<ItemComponent>;

  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemRemoved: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDragStart: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDragEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemDrop: EventEmitter<Item> = new EventEmitter<Item>();
  items = Array<Item>();

  draghover = false;

  private allItems: any;

  constructor(private sb: BuildSandbox) {
    super();
  }

  ngOnInit() {
    this.sb.items$.takeUntil(this.takeUntilDestroyed$).subscribe(res => this.allItems = res);
  }

  compatible(subject: Item): boolean {
    if (!this.items.length) {
      return true;
    }
    return this.compatibleWithItem(subject) || this.compatibleWithConsumable(subject);
  }

  rightClicked(item: Item): boolean {
    this.itemRemoved.emit(item);
    return false;  // stop context menu from appearing
  }

  lastItem() {
    return this.items[this.items.length - 1];
  }

  private compatibleWithItem(subject: Item): boolean {
    return this.buildsFrom(subject, this.lastItem());
  }

  private compatibleWithConsumable(subject: Item): boolean {
    const lastItem = this.lastItem();

    if (lastItem.time !== subject.time) {
      return lastItem.consumed;
    } else {
      return lastItem.consumed && lastItem.id === subject.id && lastItem.bundle < lastItem.stacks;
    }
  }

  private buildsFrom(subject: Item, item: Item): boolean {
    if (!subject.from || !subject.from.length || !this.allItems || !this.allItems.length) {
      return false;
    }

    for (const id of subject.from) {
      if (this.buildsFrom(this.getItem(id), item)) {
        return true;
      }
    }

    return subject.from.indexOf(item.id.toString()) > -1;
  }

  private getItem(id: string): Item {
    return this.allItems.find((item) => item.id.toString() === id);
  }
}
