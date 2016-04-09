import {Component, Input, Output, EventEmitter, OnChanges} from 'angular2/core';
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
      <item [item]="item" [ngClass]="{disabled: item.disabled}" [attr.title]="item.description" style="left: {{getXScale(item.gold.total)}}px"></item>
    </template>`
})

export class ItemsComponent implements OnChanges {
  @Input() items: Array<Object>;
  @Input() config: Config;

  // todo: remove test
  private xScaleTime = d3.scale.linear()
    .domain([0, 3600000])
    .range([0, 1500]);

  ngOnChanges() {
    // TODO: implement
  }

  getXScale(g: number) {
    return this.xScaleTime(this.getTime(this.config.g, g));
  }

  getTime(frames: Array<number>, g: number) {
    let index = 0;
    if (!this.getUpperIndex(frames, g, index)) {
      return -1;
    }

    let lowerFrame = frames[index - 1];
    let upperFrame = frames[index];

    let ratio = (g - lowerFrame) / (upperFrame - lowerFrame);

    let sampleTime = this.config.gameTime / this.config.sampleSize;
    let lowerTime = (index - 1) * sampleTime;
    let upperTime = index * sampleTime;

    return (upperTime - lowerTime) * ratio;
  }

  getUpperIndex(frames: Array<number>, g: number, index: number) {
    index = -1;
    for (var j = 0; j < frames.length; j++) {
      if (frames[j] > g) {
        index = j;
        return true;
      }
    }
    return false;
  }
}
