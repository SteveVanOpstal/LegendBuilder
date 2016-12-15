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
      <lb-item-slot (itemRemoved)="removeItem(i, $event)"></lb-item-slot>
    </template>`
})

export class ItemsComponent implements OnInit {
  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;
  items = Array<Item>();
  private samples: Samples;

  constructor(private stats: StatsService, private lolApi: LolApiService) {}

  ngOnInit() {
    this.lolApi.getCurrentMatchData().subscribe(samples => {
      this.samples = samples;
    });
  }

  addItem(item: Item) {
    item.bundle = 1;
    this.items.push(Object.assign({}, item));
    this.update();
  }

  removeItem(slotId: number, item: Item) {
    for (let index in this.items) {
      let itemCurrent = this.items[index];
      if (item.id === itemCurrent.id && item.time === itemCurrent.time) {
        this.items.splice(parseInt(index, 10), 1);
        break;
      }
    }
    this.update();
  }

  private update() {
    let result = [];
    result = this.updateTimes(this.items);
    result = this.updateBundles(result);
    this.updateSlots(result);
    this.updatePickedItems(result);
  }

  private updateTimes(items: Array<Item>): Array<Item> {
    let result = items;
    if (!this.samples) {
      return;
    }
    let goldOffset = 0;
    for (let item of result) {
      item.time = this.getTime(
          this.samples.gold, goldOffset + item.gold.total, settings.gameTime,
          settings.matchServer.sampleSize);
      goldOffset += item.gold.total;
    }
    return result;
  }

  private updateBundles(items: Array<Item>): Array<Item> {
    let result = this.clone(items);
    for (let index = 0; index < result.length - 1; index++) {
      let itemCurrent = result[index];
      let itemNext = result[index + 1];

      if (itemCurrent.id === itemNext.id && itemCurrent.bundle < itemCurrent.stacks) {
        itemCurrent.bundle++;
        result.splice(index + 1, 1);
        index--;
      }
    }
    return result;
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
    let result = [];
    for (let item of items) {
      result.push(Object.assign({}, item));
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
