import {Component, DoCheck, EventEmitter, OnInit, Output} from '@angular/core';
import {QueryList, ViewChildren} from '@angular/core';

import {LolApiService} from '../../services/lolapi.service';
import {TimeScale} from '../graph/scales';
import {Item} from '../item';

import {ItemComponent} from './item.component';

@Component({
  selector: 'lb-item-slot',
  template: `
    <ng-template ngFor let-item [ngForOf]="items">
      <div class="dropzone"
           [style.width]="item.offset + 'px'"
           [ngClass]="{draghover: draghover}"
           (dragenter)="draghover=true"
           (dragleave)="draghover=false"
           (dragover)="false"
           (drop)="itemDrop.emit(item)">
      </div>
      <lb-item #lbItem
               [item]="item"
               [ngClass]="{disabled: item.disabled}"
               (click)="this.itemSelected.emit(item)"
               (contextmenu)="rightClicked(item)"
               draggable="true"
               (dragstart)="itemDragStart.emit(item)"
               (dragend)="itemDragEnd.emit(null)">
      </lb-item>
    </ng-template>`
})

export class ItemSlotComponent implements OnInit, DoCheck {
  @ViewChildren(ItemComponent) children: QueryList<ItemComponent>;

  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemRemoved: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDragStart: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDragEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemDrop: EventEmitter<Item> = new EventEmitter<Item>();
  items = Array<Item>();

  lbItem: ItemComponent;
  draghover = false;

  private xScaleTime = new TimeScale([0, 1380]);
  private allItems: any;

  constructor(private lolApi: LolApiService) {
    this.xScaleTime.create();
  }

  ngOnInit() {
    this.lolApi.getItems().subscribe(res => {
      this.allItems = res.data;
    });
  }

  ngDoCheck() {
    let prevOffset = 0;
    for (let item of this.items) {
      item.offset = this.xScaleTime.get()(item.time) - prevOffset;
      if (item === this.items[0]) {
        prevOffset += item.offset;
        if (item.offset > 0) {
          item.offset += 56;
        }
      } else {
        if (prevOffset > 0) {
          item.offset -= 60;
        }
        prevOffset += item.offset;
      }
    }
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
    let lastItem = this.lastItem();

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
