import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {Item} from '../../item';
import {ItemBundle} from './item-bundle';

@Component({
  selector: 'lb-preview',
  template: `
    <div class="into">
      <template ngFor let-item [ngForOf]="itemsInto">
        <lb-item [item]="item"
              [attr.title]="item.name"
              (itemSelected)="selectItem($event)"
              (itemPicked)="pickItem($event)">
        </lb-item>
      </template>
    </div>
    <div class="tree">
      <div class="item" *ngIf="item">
        <h2>{{item.name}}</h2>
        <lb-item [item]="item"
                 (itemPicked)="pickItem($event)"
                 (dblclick)="pickItem(item)">
        </lb-item>
      </div>
      <div class="from">
        <hr *ngIf="itemsFrom?.length" class="down">
        <lb-items-from [items]="itemsFrom"
                    (itemSelected)="selectItem($event)"
                    (itemPicked)="pickItem($event)">
        </lb-items-from>
      </div>
      <p class="description" [innerHTML]="description">loading..</p>
    </div>`
})

export class PreviewComponent implements OnChanges {
  @Input() item: Item;
  @Input() items: Array<Item>;
  @Output() itemPicked: EventEmitter<Item> = new EventEmitter<Item>();

  itemsFrom: Array<ItemBundle>|undefined = undefined;
  itemsInto: Array<Item>|undefined = undefined;

  description: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    if (!this.item) {
      return;
    }

    this.description = this.sanitizer.bypassSecurityTrustHtml(this.item.description);

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
