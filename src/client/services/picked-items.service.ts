import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {DefaultUrlSerializer, UrlTree} from '@angular/router';
import {Subject} from 'rxjs/Subject';

import {Item} from '../build/item';

import {LolApiService} from './lolapi.service';

const availableChars: String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-';

@Injectable()
export class PickedItemsService {
  items = new Subject<Array<Item>>();
  private originalItems = new Array<Item>();
  private itemIds = new Array<Item>();
  private serializer = new DefaultUrlSerializer();

  constructor(lolapi: LolApiService, private location: Location) {
    lolapi.getItems().subscribe((items) => {
      this.originalItems = items.data;
      const urlTree = this.getUrlTree();
      this.itemIds = this.decodeItems(urlTree.queryParams['q']);
      this.update();
    });
  }

  add(item: Item) {
    this.itemIds.push(item);
    this.update();
  }

  remove(item: Item) {
    const index = this.getItemIndex(item.id, item.time);
    if (index !== undefined) {
      this.itemIds.splice(index, 1);
      this.update();
    }
  }

  move(source: Item, target: Item) {
    const indexSource = this.getItemIndex(source.id, source.time);
    const indexTarget = this.getItemIndex(target.id, target.time);
    if (indexSource && indexSource !== indexTarget) {
      this.itemIds.splice(indexSource, 1);
      this.itemIds.splice(indexSource < indexTarget ? indexTarget - 1 : indexTarget, 0, source);
    }
  }

  contains(container: Item, item: Item): boolean {
    return container.contains.find((containedItem: Item) => {
      return this.getItemIndex(containedItem.id, containedItem.time) ===
          this.getItemIndex(item.id, item.time);
    }) !== undefined;
  }

  private update() {
    this.updateQuery(this.itemIds);
    this.items.next(this.itemIds);
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
    return this.encodeItemIds(this.itemsToIds(items));
  }

  private encodeItemIds(itemIds: Array<number>): string {
    let encode = '';
    for (const id of itemIds) {
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
    return this.idsToItems(this.decodeItemIds(query));
  }

  private decodeItemIds(query: string): Array<number> {
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
      return parseInt(item.id, 10);
    });
  }

  private idsToItems(itemIds: Array<number>): Array<Item> {
    const result = new Array<Item>();
    for (const id of itemIds) {
      const resultItem = this.originalItems[id];
      if (resultItem) {
        result.push(resultItem);
      }
    }
    return result;
  }

  private getItemIndex(id: string, time: number): number|undefined {
    for (const index of Object.keys(this.itemIds)) {
      const item = this.itemIds[index];
      if (id === item.id && (time === item.time || time === -1)) {
        return parseInt(index, 10);
      }
    }
  }
}
