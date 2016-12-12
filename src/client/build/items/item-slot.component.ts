import {Component, Input, OnInit} from '@angular/core';

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
  @Input() id: number;
  items = Array<Item>();

  private allItems;

  constructor(private lolApi: LolApiService) {}

  ngOnInit() {
    this.lolApi.getItems().subscribe(res => {
      this.allItems = res.data;
    });
  }

  compatible(item: Item) {
    if (!this.items.length) {
      return true;
    }
    let item2 = this.items[this.items.length - 1];
    return this.buildsFrom(item, item2);
  }

  // TODO: move to itemComponent when angular allows events on <template>
  rightClicked(item: Item) {
    // this.removeItem(item);
    return false;  // stop context menu from appearing
  }

  private buildsFrom(subject: Item, item: Item) {
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

  // private addBundle(item: Item) {
  //   if (!this.items || !this.items.length) {
  //     return;
  //   }

  //   item.bundle = 1;
  //   for (let index = 0; index < this.items.length - 1; index++) {
  //     if (item.id === this.items[index].id && item.time === this.items[index].time) {
  //       item.bundle++;
  //       this.items.splice(index + 1, 1);
  //       index--;
  //     }
  //   }
  // }
}
