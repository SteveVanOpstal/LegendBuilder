import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {DefaultUrlSerializer, UrlTree} from '@angular/router';

import {Item} from '../../../models/item';
import {ReactiveComponent} from '../../../shared/reactive.component';
import {BuildSandbox} from '../build.sandbox';

const availableChars: String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-';

@Injectable()
export class QueryService extends ReactiveComponent {
  private originalItems = new Array<Item>();
  private serializer = new DefaultUrlSerializer();

  constructor(sb: BuildSandbox, private location: Location) {
    super();
    sb.items$.takeUntil(this.takeUntilDestroyed$).subscribe((items) => {
      if (!items || !items.length) {
        return;
      }
      this.originalItems = items;
      const urlTree = this.getUrlTree();
      let decodedItems = this.decodeItems(urlTree.queryParams['q']);
      decodedItems = this.initialiseItems(decodedItems);
      this.updateQuery(decodedItems);
      sb.setPickedItems(decodedItems);
    });

    sb.pickedItems$.takeUntil(this.takeUntilDestroyed$).subscribe((pickedItems) => {
      if (!pickedItems || !pickedItems.length) {
        return;
      }
      this.updateQuery(pickedItems);
    });
  }

  private updateQuery(items: Array<Item>) {
    const urlTree = this.getUrlTree();
    const encodedItems = this.encodeItems(items);
    if (encodedItems.length <= 0) {
      urlTree.queryParams = {};
    } else {
      urlTree.queryParams['q'] = encodedItems;
    }
    const url = this.serializer.serialize(urlTree);
    this.location.replaceState(url);
  }

  private getUrlTree(): UrlTree {
    return this.serializer.parse(this.location.path(false));
  }

  private encodeItems(items: Array<Item>): string {
    return this.encodeitems(this.itemsToIds(items));
  }

  private encodeitems(items: Array<number>): string {
    let encode = '';
    for (const id of items) {
      encode += this.encodeItem(id);
    }
    return encode;
  }

  private encodeItem(id: number): string {
    const msbLocation = Math.floor(id / 64);
    const msb = availableChars.charAt(msbLocation);
    const lsbLocation = id - (msbLocation * 64);
    const lsb = availableChars.charAt(lsbLocation);
    return msb + lsb;
  }

  private decodeItems(query: string): Array<Item> {
    return this.idsToItems(this.decodeitems(query));
  }

  private decodeitems(query: string): Array<number> {
    const result = new Array<number>();
    if (!query) {
      return result;
    }
    for (let i = 0; i < query.length / 2; i++) {
      result.push(this.decodeItem(query.substr(i * 2, 2)));
    }
    return result;
  }

  private decodeItem(query: string): number {
    const msb = availableChars.indexOf(query.charAt(0));
    const lsb = availableChars.indexOf(query.charAt(1));
    return (msb * 64) + lsb;
  }

  private itemsToIds(items: Array<Item>): Array<number> {
    return items.map((item) => {
      return item.id;
    });
  }

  private idsToItems(itemIds: Array<number>): Array<Item> {
    const result = new Array<Item>();
    for (const id of itemIds) {
      const resultItem = this.originalItems.find((originalItem) => {
        return originalItem.id === id;
      });
      if (resultItem) {
        result.push(resultItem);
      }
    }
    return result;
  }

  private initialiseItems(items: Array<Item>) {
    const result = [];
    for (const index of Object.keys(items)) {
      const item = items[index];
      result.push(Object.assign(
          {time: 0, bundle: 0, offset: 0, discount: 0, contained: false, contains: [], slotId: 0},
          item));
    }
    return result;
  }
}
