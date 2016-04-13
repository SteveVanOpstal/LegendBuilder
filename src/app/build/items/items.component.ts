import {Component, Input, Output, EventEmitter, DoCheck} from 'angular2/core';
import {NgFor, NgClass} from 'angular2/common';
import {Observable} from 'rxjs/Observable';

import {ItemComponent} from './item.component.ts';
import {Config} from '../config';

import * as d3 from 'd3'; //TODO: remove test

@Component({
  selector: 'items',
  directives: [NgFor, NgClass, ItemComponent],
  template: `
    <template ngFor #item [ngForOf]="items" #i="index">
      <item [item]="item" [ngClass]="{disabled: item.disabled}" [attr.title]="item.description" style="left: {{xScaleTime(item.time)}}px" (contextmenu)="rightClicked(item)"></item>
    </template>`
})

export class ItemsComponent implements DoCheck {
  @Input() items: Array<Object>;
  @Input() config: Config;

  // private itemWidth = 45 ~ 50;

  // todo: remove test
  private xScaleTime = d3.scale.linear()
    .domain([0, 3600000])
    .range([0, 1460]);

  ngDoCheck() {
    this.addTime();
    this.addBundle();
  }

  addTime() {
    let gold = 0;
    for (let index in this.items) {
      let item = this.items[index];
      gold += item['gold']['total'];
      let time = this.getTime(this.config.g, gold, this.config.gameTime, this.config.sampleSize);
      item['time'] = time;
    }
  }

  addBundle() {
    if (!this.items || !this.items.length || this.items[0]['bundle']) {
      return;
    }
    this.items.forEach((item) => {
      item['bundle'] = 1;
    });

    for (let index = 0; index < this.items.length - 1; index++) {
      let item = this.items[index];
      let itemNext = this.items[index + 1];
      if (item['id'] === itemNext['id'] && item['time'] === itemNext['time']) {
        item['bundle']++;
        this.items.splice(index + 1, 1);
        index--;
      }
    }
  }

  private getTime(frames: Array<number>, gold: number, gameTime: number, sampleSize: number) {
    let index = this.getUpperIndex(frames, gold);
    if (index <= -1) {
      return -1;
    }

    let lowerFrame = frames[index];
    let upperFrame = frames[index + 1];

    let ratio = (gold - lowerFrame) / (upperFrame - lowerFrame);

    let sampleTime = gameTime / sampleSize;
    let lowerTime = index * sampleTime;
    let upperTime = (index + 1) * sampleTime;

    let time = lowerTime + ((upperTime - lowerTime) * ratio);
    time = isFinite(time) ? time : lowerTime;
    return time > 0 ? time : 0;
  }

  private getUpperIndex(frames: Array<number>, gold: number) {
    for (var j = 0; j < frames.length; j++) {
      if (frames[j] > gold) {
        return j;
      }
    }
    return -1;
  }

  private rightClicked(item: Object) {
    this.items.splice(this.items.indexOf(item), 1);
    return false; // stop context menu from appearing
  }
}
