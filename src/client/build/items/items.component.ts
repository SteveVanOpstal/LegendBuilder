import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import {settings} from '../../../../config/settings';
import {LolApiService} from '../../services/lolapi.service';
import {StatsService} from '../../services/stats.service';
import {Item} from '../item';
import {Samples} from '../samples';

import {ItemSlotComponent} from './item-slot.component';

export class SlotItem {
  item: Item;
  slotId: number;

  constructor(item: Item, slotId: number) {
    this.item = Object.assign({}, item);
    this.slotId = slotId;
  }

  equals(slotId: number, item: Item) {
    return this.slotId === slotId && this.item.id === item.id && this.item.time === item.time;
  }
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
    this.addTime(item);
    item.bundle = 1;
    let slotId = this.findSlot(item);
    let slotItem = new SlotItem(item, slotId);
    this.slotItems.push(slotItem);
    this.update();
  }

  removeItem(slotId: number, item: Item) {
    for (let i in this.slotItems) {
      let index = parseInt(i, 10);
      let slotItem = this.slotItems[index];
      if (slotItem.equals(slotId, item)) {
        this.slotItems.splice(index, 1);
        break;
      }
    }
    this.updateTimes();
    this.update();
  }

  getTotalGold() {
    let gold = 0;
    for (let slotItem of this.slotItems) {
      gold += slotItem.item.gold.total;
    }
    return gold;
  }

  private addTime(item: Item) {
    if (!this.samples) {
      return;
    }
    item.time = this.getTime(
        this.samples.gold, this.getTotalGold() + item.gold.total, settings.gameTime,
        settings.matchServer.sampleSize);
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
    this.updateBundles();
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

  private updateBundles() {
    for (let index1 = 0; index1 < this.slotItems.length; index1++) {
      let slotItem1 = this.slotItems[index1];
      for (let index2 = 0; index2 < this.slotItems.length; index2++) {
        let slotItem2 = this.slotItems[index2];
        if (slotItem1.item.time < slotItem2.item.time) {
          break;
        } else if (slotItem1.equals(slotItem2.slotId, slotItem2.item) && index1 !== index2) {
          slotItem1.item.bundle++;
          this.slotItems.splice(index2, 1);
          index2--;
        }
      }
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
