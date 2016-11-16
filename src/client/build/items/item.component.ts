import {Component, ElementRef, Input, OnInit} from '@angular/core';

import {TimeScale} from '../graph/scales';
import {Item} from '../item';

@Component({
  selector: 'lb-item',
  template: `
    <img [ddragon]="'item/' + item.image.full">
    <p *ngIf="item.bundle > 1" class="bundle">x{{item.bundle}}</p>
    <p class="gold">{{item.gold.total ? item.gold.total : ''}}</p>`
})

export class ItemComponent implements OnInit {
  @Input() item: Item;
  private xScaleTime = new TimeScale([0, 1380]);

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.item.time) {
      this.xScaleTime.create();
      this.el.nativeElement.setAttribute(
          'style', 'left: ' + this.xScaleTime.get()(this.item.time) + 'px');
    }
  }
}
