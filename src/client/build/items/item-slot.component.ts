import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {LolApiService} from '../../services/lolapi.service';
import {Item} from '../item';

import {ItemComponent} from './item.component';

@Component({
  selector: 'lb-item-slot',
  template: `
    <template ngFor let-item [ngForOf]="items">
      <div class="dropzone"
           [style.width]="lbItem.offset + 'px'"
           [ngClass]="{draghover: draghover}"
           (dragenter)="draghover=true"
           (dragleave)="draghover=false"
           (dragover)="dragover()"
           (drop)="drop(item)">
      </div>
      <lb-item #lbItem
               [item]="item"
               [ngClass]="{disabled: item.disabled, dragging: dragging}"
               (contextmenu)="rightClicked(item)"
               draggable="true"
               (dragstart)="dragstart(item)"
               (dragend)="dragend()">
      </lb-item>
    </template>`
})

export class ItemSlotComponent implements OnInit {
  @Output() itemRemoved: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDragStart: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDragEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemDrop: EventEmitter<Item> = new EventEmitter<Item>();
  items = Array<Item>();

  lbItem: ItemComponent;
  dragging = false;
  draghover = false;

  private allItems: any;

  constructor(private lolApi: LolApiService) {}

  ngOnInit() {
    this.lolApi.getItems().subscribe(res => {
      this.allItems = res.data;
    });
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

  dragstart(item: Item) {
    this.dragging = true;
    this.itemDragStart.emit(item);
  }

  dragover() {
    return false;  // allow drop
  }

  dragend() {
    this.dragging = false;
    this.itemDragEnd.emit(null);
  }

  drop(item: Item) {
    this.dragging = false;
    this.itemDrop.emit(item);
  }

  private compatibleWithItem(subject: Item): boolean {
    let lastItem = this.items[this.items.length - 1];
    return this.buildsFrom(subject, lastItem);
  }

  private compatibleWithConsumable(subject: Item): boolean {
    let lastItem = this.items[this.items.length - 1];

    if (lastItem.time !== subject.time) {
      return lastItem.consumed;
    } else {
      return lastItem.consumed && lastItem.id === subject.id && lastItem.bundle < lastItem.stacks;
    }
  }

  private buildsFrom(subject: Item, item: Item): boolean {
    let from = subject.from;
    if (!from) {
      return false;
    }

    for (let i of from) {
      if (this.buildsFrom(this.allItems[i], item)) {
        return true;
      }
    }

    return from.indexOf(item.id.toString()) > -1;
  }
}
