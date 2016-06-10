import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {NgIf} from '@angular/common';

import {DDragonDirective} from '../../../misc/ddragon.directive';

import {ItemComponent} from './item.component';
import {ItemsFromComponent} from './items-from.component';
import {Item} from '../../../misc/item';
import {ItemBundle} from './item-bundle';

@Component({
  selector: 'preview',
  directives: [NgIf, DDragonDirective, ItemComponent, ItemsFromComponent],
  template: `
    <div class="into">
      <template ngFor let-item [ngForOf]="itemsInto">
        <item [item]="item" [attr.title]="item.name" (itemSelected)="selectItem(item)" (itemPicked)="itemPicked"></item>
      </template>
    </div>
    <div class="tree">
      <div class="item" *ngIf="item">
        <h2>{{item.name}}</h2>
        <item [item]="item" (itemPicked)="itemPicked"></item>
      </div>
      <div class="from">
        <hr *ngIf="itemsFrom?.length" class="down">
        <items-from [items]="itemsFrom" (itemSelected)="selectItem($event)" (itemPicked)="itemPicked"></items-from>
      </div>
      <p class="description">{{item?.description}}</p>
    </div>`
})

export class PreviewComponent implements OnChanges {
  @Input() item: Item;
  @Input() items: Array<Item>;
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();

  private itemsFrom: Array<ItemBundle> = new Array<ItemBundle>();
  private itemsInto: Array<any> = new Array<any>();

  ngOnChanges() {
    if (!this.item) {
      return;
    }
    this.itemsFrom = this.getItemsFrom(this.item);
    this.itemsInto = this.getItemsInto(this.item);
  }

  private getItemsFrom(baseItem: Item): Array<ItemBundle> {
    let items = this.getItems(baseItem.from);
    if (!items || !items.length) {
      return;
    }
    let arr = Array<ItemBundle>();
    items.forEach((item: Item) => {
      arr.push({
        item: item, children: this.getItemsFrom(item)
      });
    });
    return arr;
  }

  private getItemsInto(item: Item) {
    return this.getItems(item.into);
  }

  private getItems(itemIds: Array<string>): Array<Item> {
    if (!this.items || !itemIds || !itemIds.length) {
      return;
    }
    return this.items.filter((item: Item) => {
      return itemIds.indexOf(item.id.toString()) > -1;
    });
  }

  private selectItem(item: Item) {
    this.item = item;
    this.ngOnChanges();
  }

  private pickItem(item: Item) {
    this.itemPicked.emit(item);
    return false; // stop context menu from appearing
  }
}
