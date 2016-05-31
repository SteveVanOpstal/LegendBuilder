import {Component, Input, Inject, forwardRef, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {Observable} from 'rxjs/Observable';

import {ItemsComponent} from './items.component';
import {ItemComponent} from './item.component';
import {Item} from '../../misc/item';
import {Config} from '../config';

import * as d3 from 'd3'; // TODO: remove test

@Component({
  selector: 'item-slot',
  directives: [NgClass, ItemComponent],
  template: `
    <template ngFor let-item [ngForOf]="items">
      <item [item]="item" [ngClass]="{disabled: item.disabled}" style="left: {{xScaleTime(item.time)}}px" (contextmenu)="rightClicked(item)"></item>
    </template>`
})

export class ItemSlotComponent implements OnInit {
  @Input() id: number;
  @Input() config: Config;
  private items: Array<any> = new Array<any>();

  // TODO: move to itemComponent when angular allows attributes on <template>
  // TODO: get this scale from shopComponent
  private xScaleTime = d3.scale.linear()
    .domain([0, 3600000])
    .range([0, 1460]);

  constructor( @Inject(forwardRef(() => ItemsComponent)) private itemsComponent: ItemsComponent) {
  }

  ngOnInit() {
    this.itemsComponent.addItemSlotComponent(this);
  }

  addItem(item: Item) {
    this.addTime(item);
    this.addBundle(item);
    this.items.push(item);
  }

  removeItem(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  compatible(item: Item) {
    if (!this.items.length) {
      return true;
    }
    let from = this.items[this.items.length - 1].from;
    if (!from) {
      return true;
    }
    return from.indexOf(item.id) > -1;
  }

  private addTime(item: Item) {
    item.time = this.getTime(this.config.g, item.gold.total, this.config.gameTime, this.config.sampleSize);
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

  // TODO: move to itemComponent when angular allows events on <template>
  private rightClicked(item: Item) {
    this.removeItem(item);
    return false; // stop context menu from appearing
  }
}
