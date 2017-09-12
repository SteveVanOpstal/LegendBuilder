import {Component, EventEmitter, OnInit, Output, QueryList, ViewChildren} from '@angular/core';

import {settings} from '../../../../config/settings';
import {LolApiService, PickedItemsService, StatsService} from '../../services';
import {Item} from '../item';
import {Samples} from '../samples';

import {ItemSlotComponent} from './item-slot.component';

@Component({
  selector: 'lb-items',
  styleUrls: ['./items.component.scss'],
  template: `
    <ng-template ngFor [ngForOf]="[0,1,2,3,4,5]">
      <lb-item-slot [ngClass]="{dragging: dragging}"
                    (itemSelected)="itemSelected.emit($event)"
                    (itemRemoved)="removeItem($event)"
                    (itemDragStart)="itemDragStart($event)"
                    (itemDragEnd)="itemDragEnd()"
                    (itemDrop)="itemDrop($event)">
      </lb-item-slot>
    </ng-template>`
})

export class ItemsComponent implements OnInit {
  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;
  items = Array<Item>();

  dragging = false;
  dragged: Item;

  private samples: Samples;
  private allItems: any;

  constructor(
      private stats: StatsService, private lolApi: LolApiService,
      private pickedItems: PickedItemsService) {
    pickedItems.items.subscribe(items => {
      this.items = items;
      this.update();
    });
  }

  ngOnInit() {
    this.lolApi.getItems().subscribe(res => {
      this.allItems = res.data;
    });
    this.lolApi.getCurrentMatchData().subscribe(samples => {
      this.samples = samples;
    });
  }

  removeItem(item: Item) {
    this.pickedItems.remove(item);
  }

  itemDragStart(item: Item) {
    this.dragged = item;
    this.dragging = true;
  }

  itemDragEnd() {
    this.dragging = false;
  }

  itemDrop(item: Item) {
    this.dragging = false;
    this.pickedItems.move(this.dragged, item);
  }

  private update() {
    let result = this.clone(this.items);
    result = this.updateBundles(result);
    result = this.updateDiscounts(result);
    result = this.updateTimes(result);
    this.updateOriginalItems(result);
    this.updateSlots(result);
    this.updatePickedItems(result);
  }

  private updateBundles(items: Array<Item>): Array<Item> {
    for (const item of items) {
      if (!item.bundle) {
        item.bundle = 1;
      }
    }

    for (let index = 0; index < items.length - 1; index++) {
      const itemCurrent = items[index];
      const itemNext = items[index + 1];
      if (itemCurrent.id === itemNext.id && itemCurrent.bundle < itemCurrent.stacks) {
        itemCurrent.bundle++;
        items.splice(index + 1, 1);
        index--;
      }
    }
    return items;
  }

  private updateDiscounts(items: Array<Item>): Array<Item> {
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items[itemIndex];
      item.discount = 0;
      item.contains = [];
      item.contained = false;
      for (let searchItemIndex = 0; searchItemIndex < itemIndex; searchItemIndex++) {
        const searchItem = items[searchItemIndex];
        if (!item.from || !searchItem || searchItem.contained) {
          continue;
        }
        const itemFromIds = this.getItemsFrom(item).filter((itemFrom: string) => {
          return itemFrom.toString() === searchItem.id.toString();
        });
        const itemContainsIds = item.contains.filter((itemContains) => {
          return itemContains.id === searchItem.id;
        });
        if (itemFromIds.length > itemContainsIds.length) {
          item.discount += searchItem.gold.total;
          searchItem.contained = true;
          item.contains.push({...searchItem});
        }
      }
    }
    return items;
  }

  private updateTimes(items: Array<Item>): Array<Item> {
    if (!this.samples) {
      return;
    }
    let goldOffset = 0;
    for (const item of items) {
      const itemGold = (item.gold.total * item.bundle) - item.discount;
      item.time = this.getTime(
          this.samples.gold, goldOffset + itemGold, settings.gameTime, settings.match.sampleSize);
      goldOffset += itemGold;
    }
    return items;
  }

  private updateOriginalItems(items: Array<Item>) {
    if (!items) {
      return;
    }
    for (const index of Object.keys(items)) {
      const i = parseInt(index, 10);
      for (let index2 = 0; index2 < items[i].bundle; index2 += 1) {
        this.items[i + index2].time = items[i].time;
      }
    }
  }

  private updateSlots(items: Array<Item>): void {
    if (!items) {
      return;
    }
    this.children.forEach((slot: ItemSlotComponent) => {
      slot.items = [];
    });
    for (const item of items) {
      const slot = this.findSlot(item);
      if (slot) {
        slot.items.push(item);
      }
    }
  }

  private updatePickedItems(items: Array<Item>): void {
    this.stats.pickedItems.next(items);
  }


  private clone(items: Array<Item>): Array<Item> {
    const result: Array<Item> = [];
    for (const item of items) {
      result.push({...item});
    }
    return result;
  }

  private getItemsFrom(baseItem: Item): Array<string> {
    if (!baseItem.from || !baseItem.from.length || !this.allItems) {
      return [];
    }
    let items: Array<Item> = baseItem.from.map((id: string) => {
      return this.allItems[id];
    });
    let arr = Array<string>();
    for (const item of items) {
      arr = arr.concat(item.id, this.getItemsFrom(item));
    }
    return arr;
  }

  private getTime(frames: Array<number>, value: number, totalTime: number, sampleSize: number):
      number {
    const index = this.getUpperIndex(frames, value);
    if (index <= -1) {
      return -1;
    }

    const lowerFrame = frames[index];
    const upperFrame = frames[index + 1];

    const ratio = (value - lowerFrame) / (upperFrame - lowerFrame);

    const sampleTime = totalTime / sampleSize;
    const lowerTime = index * sampleTime;
    const upperTime = (index + 1) * sampleTime;

    let time = lowerTime + ((upperTime - lowerTime) * ratio);
    time = isFinite(time) ? time : lowerTime;
    return time > 0 ? time : 0;
  }

  private getUpperIndex(frames: Array<number>, gold: number): number {
    for (let j = 0; j < frames.length; j++) {
      if (frames[j] > gold) {
        return j;
      }
    }
    return -1;
  }

  private findSlot(item: Item): ItemSlotComponent|undefined {
    return this.children.toArray().find((slot: ItemSlotComponent) => {
      return slot.compatible(item) || this.compatible(slot);
    });
  }

  private compatible(slot: ItemSlotComponent): boolean {
    const lastItem = slot.lastItem();
    if (!lastItem.contained) {
      return false;
    }
    const childSlot = this.children.toArray().find((child: ItemSlotComponent) => {
      return this.lastItemEquals(child, lastItem);
    });
    return childSlot !== undefined;
  }

  private lastItemEquals(slot: ItemSlotComponent, item: Item): boolean {
    const lastSlotItem = slot.lastItem();
    if (!lastSlotItem || !lastSlotItem.contains.length) {
      return false;
    }
    return this.pickedItems.contains(lastSlotItem, item);
  }
}
