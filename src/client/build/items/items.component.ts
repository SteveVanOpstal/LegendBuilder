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
    <lb-item-slot [id]="0"></lb-item-slot>
    <lb-item-slot [id]="1"></lb-item-slot>
    <lb-item-slot [id]="2"></lb-item-slot>
    <lb-item-slot [id]="3"></lb-item-slot>
    <lb-item-slot [id]="4"></lb-item-slot>
    <lb-item-slot [id]="5"></lb-item-slot>`
})

export class ItemsComponent implements OnInit {
  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;
  private samples: Samples;
  private slotItems: Array<SlotItem> = new Array<SlotItem>();

  constructor(private stats: StatsService, private lolApi: LolApiService) {}

  ngOnInit() {
    this.lolApi.getCurrentMatchData().subscribe(samples => {
      this.samples = samples;
    });
  }

  addItem(item: Item) {
    let slotId = this.findSlot(item);
    let slotItem = {item, slotId};
    this.slotItems.push(slotItem);
    this.addTime(slotItem);
    this.update();
  }

  private addTime(slotItem: SlotItem) {
    if (this.samples) {
      let goldOffset = this.getGoldOffset(slotItem);
      slotItem.item.time = this.getTime(
          this.samples.gold, goldOffset + slotItem.item.gold.total, settings.gameTime,
          settings.matchServer.sampleSize);
    }
  }

  private getGoldOffset(input: SlotItem): number {
    let gold = 0;
    for (let slotItem of this.slotItems) {
      if (slotItem === input) {
        break;
      } else {
        gold += slotItem.item.gold.total;
      }
    }
    return gold;
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

  private findSlot(item: Item): number {
    let s = this.children.toArray().find((slot: ItemSlotComponent) => {
      return slot.compatible(item);
    });
    if (s) {
      return s.id;
    }
  }

  private update() {
    this.updateItemSlots();
    this.updatePickedItems();
  }

  private updateItemSlots() {
    this.children.toArray().forEach((slot: ItemSlotComponent) => {
      slot.items = this.getItemsForSlot(slot.id);
    });
  }

  private updatePickedItems() {
    this.stats.pickedItems.next(this.getItems());
  }

  private getItems(): Array<Item> {
    return this.slotItems.map((slotItem: SlotItem) => {
      return slotItem.item;
    });
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
}
