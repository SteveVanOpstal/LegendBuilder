import {Component, EventEmitter, OnInit, Output, QueryList, ViewChildren} from '@angular/core';

import {settings} from '../../../../../config/settings';
import {Item} from '../../../data/item';
import {Samples} from '../../../data/samples';
import {StatsService} from '../../../services';
import {ReactiveComponent} from '../../../shared/reactive.component';
import {BuildSandbox} from '../build.sandbox';
import {TimeScale} from '../graph/scales';

import {ItemSlotComponent} from './item-slot/item-slot.component';

@Component({
  selector: 'lb-items',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1500 300">
      <ng-template ngFor let-item [ngForOf]="items">
        <ng-template [ngIf]="!item.contained">
          <g lbItemCurve [item]="item"></g>
        </ng-template>
      </ng-template>
      <ng-template ngFor [ngForOf]="[0,1,2,3,4,5]" let-i="index">
        <g lbItemSlot [attr.transform]="'translate(0,' + (i*50) + ')'"
                      [ngClass]="{dragging: dragging}"
                      (itemSelected)="itemSelected.emit($event)"
                      (itemRemoved)="removeItem($event)"
                      (itemDragStart)="itemDragStart($event)"
                      (itemDragEnd)="itemDragEnd()">
        </g>
      </ng-template>
    </svg>`
})

export class ItemsComponent extends ReactiveComponent implements OnInit {
  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;

  dragging = false;
  dragged: Item;

  start = {x: 0, y: 0};
  end = {x: 0, y: 0};

  items = Array<Item>();
  private samples: Samples;
  private allItems: any;
  private xScaleTime = new TimeScale([0, 1420]);

  constructor(private stats: StatsService, private sb: BuildSandbox) {
    super();
  }

  ngOnInit() {
    this.sb.pickedItems$.takeUntil(this.takeUntilDestroyed$).subscribe(items => {
      this.items = items;
      this.update();
    });
    this.sb.items$.takeUntil(this.takeUntilDestroyed$).subscribe(res => {
      this.allItems = res;
      this.update();
    });
    this.sb.matchdata$.takeUntil(this.takeUntilDestroyed$).subscribe(samples => {
      this.samples = samples;
      this.update();
    });
  }

  removeItem(item: Item) {
    this.sb.removeItem(item);
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
    this.sb.move(this.dragged, item);
  }

  private update() {
    let result = this.items;
    result = this.updateBundles(result);
    result = this.updateDiscounts(result);
    result = this.updateTimes(result);
    result = this.updateOffsets(result);
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
          item.contains.push(searchItem);
        }
      }
    }
    return items;
  }

  private updateTimes(items: Array<Item>): Array<Item> {
    if (!this.samples) {
      return items;
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

  private updateOffsets(items: Array<Item>): Array<Item> {
    for (const item of items) {
      item.offset = this.xScaleTime.get()(item.time);
    }
    return items;
  }

  private updateOriginalItems(items: Array<Item>): void {
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
    if (!this.children) {
      return;
    }
    this.children.forEach((slot: ItemSlotComponent) => {
      slot.items = [];
    });
    if (!items || !items.length) {
      return;
    }
    for (const item of items) {
      const slot = this.findSlot(item);
      if (slot) {
        slot.items.push(item);
      } else {
        console.log('unable to find slot');
        this.sb.removeItem(item);
      }
    }
  }

  private updatePickedItems(items: Array<Item>): void {
    this.stats.pickedItems.next(items);
  }

  private getItemsFrom(baseItem: Item): Array<string> {
    if (!baseItem.from || !baseItem.from.length || !this.allItems || !this.allItems.length) {
      return [];
    }
    const items: Array<Item> = baseItem.from.map((id: string) => {
      return this.getItem(id);
    });
    let arr = Array<string>();
    for (const item of items) {
      arr = arr.concat(item.id, this.getItemsFrom(item));
    }
    return arr;
  }

  private getItem(id: string): Item {
    return this.allItems.find((item) => item.id.toString() === id);
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
    return this.children.toArray().find((slot: ItemSlotComponent, index: number) => {
      if (slot.compatible(item) || this.compatible(slot)) {
        item.slotId = index;
        return true;
      }
      return false;
    });
  }

  private compatible(slot: ItemSlotComponent): boolean {
    const lastItem = slot.lastItem();
    if (!lastItem.contained) {
      return false;
    }
    const childSlot = this.children.toArray().find((child: ItemSlotComponent) => {
      return this.contains(child.lastItem(), lastItem);
    });
    return childSlot !== undefined;
  }

  private contains(container: Item, item: Item): boolean {
    if (!container || !container.contains.length) {
      return false;
    }
    return container.contains.find((containedItem: Item) => {
      if (containedItem === item) {
        return true;
      } else if (containedItem.contains.length) {
        if (this.contains(containedItem, item)) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    }) !== undefined;
  }
}
