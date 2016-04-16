import {Component, Input, OnChanges} from 'angular2/core';
import {NgIf} from 'angular2/common';

import {DDragonDirective} from '../../../misc/ddragon.directive';

import {ItemComponent} from './item.component';
import {ItemsFromComponent} from './items-from.component';
import {ItemBundle} from './item-bundle';

@Component({
  selector: 'preview',
  directives: [NgIf, DDragonDirective, ItemComponent, ItemsFromComponent],
  template: `
    <div class="into">
      <template ngFor #item [ngForOf]="itemsInto">
        <item [item]="item" [attr.title]="item.name" (click)="leftClick(item)"></item>
      </template>
    </div>
    <div class="tree">
      <div class="item" *ngIf="item">
        <h2>{{item.name}}</h2>
        <img [ddragon]="'item/' + item.image.full">
      </div>
      <div class="from">
        <items-from [items]="itemsFrom" (itemPicked)="leftClick($event)"></items-from>
      </div>
      <p class="gold">{{item?.gold?.total ? item?.gold?.total : ''}}</p>
      <p class="description">{{item?.description}}</p>
    </div>`
})

export class PreviewComponent implements OnChanges {
  @Input() item;
  @Input() items;

  private itemsFrom: Array<ItemBundle> = new Array<ItemBundle>();
  private itemsInto: Array<Object> = new Array<Object>();

  ngOnChanges() {
    if (!this.item) {
      return;
    }
    this.itemsFrom = new Array<ItemBundle>();
    this.itemsInto = new Array<Object>();
    if (this.item['from']) {
      this.getItemsFrom();
    }
    if (this.item['into']) {
      this.getItemsInto();
    }
  }

  private getItemsFrom() {
    this.itemsFrom = this.getChildren(this.item);
  }

  private getChildren(item: Object): Array<ItemBundle> {
    return this.recur(this.getItems(item, (item: Object) => {
      return item['from'];
    }));
  }

  private recur(items: Array<Object>): Array<ItemBundle> {
    if (!items) {
      return;
    }
    let arr = Array<ItemBundle>();
    items.forEach((item: Object) => {
      arr.push({
        item: item, children: this.getChildren(item)
      });
    });
    return arr;
  }

  private getItemsInto() {
    this.itemsInto = this.getItems(this.item, (item: Object) => {
      return item['into'];
    });
  }

  private getItems(item: Object, callback: (item: Object) => Array<string>): Array<Object> {
    if (!this.items) {
      return;
    }
    let ids = callback(item);
    if (!ids || !ids.length) {
      return;
    }
    return this.items.filter((item: Object) => {
      return ids.indexOf(item['id'].toString()) > -1;
    });
  }

  private leftClick(item) {
    this.item = item;
    this.ngOnChanges();
  }
}
