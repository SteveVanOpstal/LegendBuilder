import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import {settings} from '../../../../config/settings';
import {LolApiService} from '../../services/lolapi.service';
import {StatsService} from '../../services/stats.service';
import {Item} from '../item';
import {Samples} from '../samples';

import {ItemSlotComponent} from './item-slot.component';

@Component({
  selector: 'lb-items',
  template: `
    <template ngFor let-i [ngForOf]="[0,1,2,3,4,5]">
      <lb-item-slot [ngClass]="{dragging: dragging}"
                    (itemRemoved)="removeItem($event)"
                    (itemDragStart)="itemDragStart($event)"
                    (itemDragEnd)="itemDragEnd()"
                    (itemDrop)="itemDrop($event)">
      </lb-item-slot>
    </template>`
})

export class ItemsComponent implements OnInit {
  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;
  items = Array<Item>();

  dragging = false;
  dragged: Item;

  private samples: Samples;

  constructor(private stats: StatsService, private lolApi: LolApiService) {}

  ngOnInit() {
    this.lolApi.getCurrentMatchData().subscribe(samples => {
      this.samples = samples;
    });
  }

  addItem(item: Item) {
    item.bundle = 1;
    this.items.push({...item});
    this.update();
  }

  removeItem(item: Item) {
    let index = this.getItemIndex(item.id, item.time);
    if (index !== undefined) {
      this.items.splice(index, 1);
      this.update();
    }
  }

  switchItem(source: Item, target: Item) {
    let indexSource = this.getItemIndex(source.id, source.time);
    let indexTarget = this.getItemIndex(target.id, target.time);
    if (indexSource && indexSource !== indexTarget) {
      this.items.splice(indexSource, 1);
      this.items.splice(indexSource < indexTarget ? indexTarget - 1 : indexTarget, 0, source);
      this.update();
    }
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
    this.switchItem(this.dragged, item);
  }

  private getItemIndex(id: string, time: number): number|undefined {
    for (let index in this.items) {
      let item = this.items[index];
      if (id === item.id && time === item.time) {
        return parseInt(index, 10);
      }
    }
  }

  private update() {
    let result = this.clone(this.items);
    result = this.updateBundles(result);
    result = this.updateTimes(result);
    this.updateOriginalItems(result);
    this.updateSlots(result);
    this.updatePickedItems(result);
  }

  private updateBundles(items: Array<Item>): Array<Item> {
    for (let index = 0; index < items.length - 1; index++) {
      let itemCurrent = items[index];
      let itemNext = items[index + 1];

      if (itemCurrent.id === itemNext.id && itemCurrent.bundle < itemCurrent.stacks) {
        itemCurrent.bundle++;
        items.splice(index + 1, 1);
        index--;
      }
    }
    return items;
  }

  private updateTimes(items: Array<Item>): Array<Item> {
    if (!this.samples) {
      return;
    }
    let goldOffset = 0;
    for (let item of items) {
      let itemGold = (item.gold.total * item.bundle);
      item.time = this.getTime(
          this.samples.gold, goldOffset + itemGold, settings.gameTime,
          settings.matchServer.sampleSize);
      goldOffset += itemGold;
    }
    return items;
  }

  private updateOriginalItems(items: Array<Item>) {
    for (let index in items) {
      let i = parseInt(index, 10);
      for (let index2 = 0; index2 < items[i].bundle; index2 += 1) {
        this.items[i + index2].time = items[i].time;
      }
    }
  }

  private updateSlots(items: Array<Item>): void {
    this.children.forEach((slot: ItemSlotComponent) => {
      slot.items = [];
    });
    for (let item of items) {
      let slot = this.findSlot(item);
      if (slot) {
        slot.items.push(item);
      }
    }
  }

  private updatePickedItems(items: Array<Item>): void {
    this.stats.pickedItems.next(items);
  }


  private clone(items: Array<Item>): Array<Item> {
    let result: Array<Item> = [];
    for (let item of items) {
      result.push({...item});
    }
    return result;
  }

  private getTime(frames: Array<number>, value: number, totalTime: number, sampleSize: number):
      number {
    let index = this.getUpperIndex(frames, value);
    if (index <= -1) {
      return -1;
    }

    let lowerFrame = frames[index];
    let upperFrame = frames[index + 1];

    let ratio = (value - lowerFrame) / (upperFrame - lowerFrame);

    let sampleTime = totalTime / sampleSize;
    let lowerTime = index * sampleTime;
    let upperTime = (index + 1) * sampleTime;

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
      return slot.compatible(item);
    });
  }
}
