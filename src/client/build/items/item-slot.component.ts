import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {LolApiService} from '../../services/lolapi.service';
import {Item} from '../item';

@Component({
  selector: 'lb-item-slot',
  template: `
    <template ngFor let-item [ngForOf]="items">
      <lb-item [item]="item"
               [ngClass]="{disabled: item.disabled}"
               (contextmenu)="rightClicked(item)">
      </lb-item>
    </template>`
})

export class ItemSlotComponent implements OnInit {
  @Output() itemRemoved: EventEmitter<Item> = new EventEmitter<Item>();
  items = Array<Item>();

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
    this.removeItem(item);
    return false;  // stop context menu from appearing
  }

  removeItem(item: Item) {
    this.itemRemoved.emit(item);
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
