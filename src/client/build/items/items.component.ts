import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import {settings} from '../../../../config/settings';
import {LolApiService} from '../../services/lolapi.service';
import {StatsService} from '../../services/stats.service';
import {Item} from '../item';
import {Samples} from '../samples';

import {ItemSlotComponent} from './item-slot.component';

export interface SlotItem {
  item: Item;
  slotId: number;
}

@Component({
  selector: 'lb-items',
  template: `
    <template ngFor let-i [ngForOf]="[0,1,2,3,4,5]">
      <lb-item-slot [id]="i" (itemRemoved)="removeItem(i, $event)"></lb-item-slot>
    </template>`
})

export class ItemsComponent implements OnInit {
  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;
  slotItems: Array<SlotItem> = Array<SlotItem>();
  private samples: Samples;

  constructor(private stats: StatsService, private lolApi: LolApiService) {}

  ngOnInit() {
    this.lolApi.getCurrentMatchData().subscribe(samples => {
      this.samples = samples;
    });
  }

  addItem(item: Item) {
    let slotId = this.findSlot(item);
    let slotItem = {item: Object.assign({}, item), slotId: slotId};
    this.slotItems.push(slotItem);
    this.update();
  }

  removeItem(slotId: number, item: Item) {
    for (let i in this.slotItems) {
      let index = parseInt(i, 10);
      let slotItem = this.slotItems[index];
      if (slotItem.slotId === slotId && slotItem.item.time === item.time) {
        this.slotItems.splice(index, 1);
        break;
      }
    }
    this.update();
  }

  private findSlot(item: Item): number {
    let s = this.children.toArray().find((slot: ItemSlotComponent) => {
      return slot.compatible(item);
    });
    if (s) {
      return s.id;
    }
  }

  private update() {
    this.updateTimes();
    this.updateItemSlots();
    this.updatePickedItems();
  }

  private updateTimes() {
    if (!this.samples) {
      return;
    }
    let goldOffset = 0;
    for (let slotItem of this.slotItems) {
      slotItem.item.time = this.getTime(
          this.samples.gold, goldOffset + slotItem.item.gold.total, settings.gameTime,
          settings.matchServer.sampleSize);
      goldOffset += slotItem.item.gold.total;
    }
  }

  private updateItemSlots() {
    this.children.toArray().forEach((slot: ItemSlotComponent) => {
      slot.items = this.getItemsForSlot(slot.id);
    });
  }

  private updatePickedItems() {
    this.stats.pickedItems.next(this.getItems());
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

  private getItemsForSlot(slotId: number): Array<Item> {
    return this.slotItems
        .filter((slotItem: SlotItem) => {
          return slotItem.slotId === slotId;
        })
        .map((slotItem: SlotItem) => {
          return slotItem.item;
        });
  }

  private getItems(): Array<Item> {
    return this.slotItems.map((slotItem: SlotItem) => {
      return slotItem.item;
    });
  }
}
