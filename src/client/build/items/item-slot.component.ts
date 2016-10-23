import {Component, Input, OnInit} from '@angular/core';

import {settings} from '../../../../config/settings';
import {BuildService} from '../../services/build.service';
import {Item} from '../item';
import {Samples} from '../samples';

@Component({
  selector: 'item-slot',
  template: `
    <template ngFor let-item [ngForOf]="items">
      <item [item]="item" [ngClass]="{disabled: item.disabled}" (contextmenu)="rightClicked(item)"></item>
    </template>`
})

export class ItemSlotComponent implements OnInit {
  @Input() id: number;
  private samples: Samples;
  private items: Array<Item> = new Array<Item>();

  constructor(private build: BuildService) {}

  ngOnInit() {
    this.build.samples.subscribe(samples => {
      this.samples = samples;
    });
  }

  addItem(item: Item) {
    this.addTime(item);
    this.addBundle(item);
    this.items.push(item);
  }

  removeItem(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  getItems(): Array<Item> {
    return this.items;
  }

  compatible(item: Item) {
    if (!this.items.length) {
      return true;
    }
    let from = this.items[this.items.length - 1].from;
    if (!from) {
      return true;
    }
    return from.indexOf(item.id.toString()) > -1;
  }

  // TODO: move to itemComponent when angular allows events on <template>
  rightClicked(item: Item) {
    this.removeItem(item);
    return false;  // stop context menu from appearing
  }

  private addTime(item: Item) {
    if (this.samples) {
      item.time = this.getTime(
          this.samples.gold, item.gold.total, settings.gameTime, settings.matchServer.sampleSize);
    }
  }

  private addBundle(item: Item) {
    if (!this.items || !this.items.length) {
      return;
    }

    item.bundle = 1;
    for (let index = 0; index < this.items.length - 1; index++) {
      if (item.id === this.items[index].id && item.time === this.items[index].time) {
        item.bundle++;
        this.items.splice(index + 1, 1);
        index--;
      }
    }
  }

  private getTime(frames: Array<number>, value: number, totalTime: number, sampleSize: number) {
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

  private getUpperIndex(frames: Array<number>, gold: number) {
    for (let j = 0; j < frames.length; j++) {
      if (frames[j] > gold) {
        return j;
      }
    }
    return -1;
  }
}
