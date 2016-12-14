import {Component, DoCheck, ElementRef, Input} from '@angular/core';

import {TimeScale} from '../graph/scales';
import {Item} from '../item';

@Component({
  selector: 'lb-item',
  template: `
    <img [lbDDragon]="'item/' + item.image.full">
    <p *ngIf="item.bundle > 1" class="bundle">x{{item.bundle}}</p>
    <p class="gold">{{item.gold.total ? item.gold.total : ''}}</p>`
})

export class ItemComponent implements DoCheck {
  @Input() item: Item;
  itemPrev: Item;
  private xScaleTime = new TimeScale([0, 1380]);

  constructor(private el: ElementRef) {
    this.xScaleTime.create();
  }

  ngDoCheck() {
    if (!this.item) {
      return;
    }
    let offset = this.xScaleTime.get()(this.item.time);
    this.el.nativeElement.setAttribute('style', 'left: ' + offset + 'px');
    this.itemPrev = this.item;
  }
}
