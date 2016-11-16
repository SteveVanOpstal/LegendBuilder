import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import {Item} from '../../item';
import {ItemBundle} from './item-bundle';

@Component({
  selector: 'lb-preview',
  template: `
    <div class="into">
      <template ngFor let-item [ngForOf]="itemsInto">
        <lb-item [item]="item"
              [attr.title]="item.name"
              (itemSelected)="selectItem(item)"
              (itemPicked)="itemPicked">
        </lb-item>
      </template>
    </div>
    <div class="tree">
      <div class="item" *ngIf="item">
        <h2>{{item.name}}</h2>
        <lb-item [item]="item" (itemPicked)="itemPicked"></lb-item>
      </div>
      <div class="from">
        <hr *ngIf="itemsFrom?.length" class="down">
        <lb-items-from [items]="itemsFrom"
                    (itemSelected)="selectItem($event)"
                    (itemPicked)="itemPicked">
        </lb-items-from>
      </div>
      <p class="description">{{item?.description}}</p>
    </div>`
})

export class PreviewComponent implements OnChanges {
  @Input() item: Item;
  @Input() items: Array<Item>;
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();

  private itemsFrom: Array<ItemBundle>|undefined = undefined;
  private itemsInto: Array<Item>|undefined = undefined;

  ngOnChanges() {
    if (!this.item) {
      return;
    }
    this.itemsFrom = this.getItemsFrom(this.item);
    this.itemsInto = this.getItemsInto(this.item);
  }

  selectItem(item: Item) {
    this.item = item;
    this.ngOnChanges();
  }

  pickItem(item: Item) {
    this.itemPicked.emit(item);
    return false;  // stop context menu from appearing
  }

  private getItemsFrom(baseItem: Item): Array<ItemBundle>|undefined {
    let items = this.getItems(baseItem.from);
    if (!items || !items.length) {
      return;
    }
    let arr = Array<ItemBundle>();
    items.forEach((item: Item) => {
      arr.push({item: item, children: this.getItemsFrom(item)});
    });
    return arr;
  }

  private getItemsInto(item: Item): Array<Item>|undefined {
    return this.getItems(item.into);
  }

  private getItems(itemIds: Array<string>): Array<Item>|undefined {
    if (!this.items || !itemIds || !itemIds.length) {
      return;
    }
    return this.items.filter((item: Item) => {
      return itemIds.indexOf(item.id.toString()) > -1;
    });
  }
}
