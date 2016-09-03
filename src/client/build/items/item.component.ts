import {NgIf} from '@angular/common';
import {Component, ElementRef, Input, OnInit} from '@angular/core';

import {DDragonDirective} from '../../misc/ddragon.directive';
import {TimeScale} from '../graph/scales';
import {Item} from '../item';

@Component({
  selector: 'item',
  directives: [NgIf, DDragonDirective],
  template: `
    <img [ddragon]="'item/' + item.image.full">
    <p *ngIf="item.bundle > 1" class="bundle">x{{item.bundle}}</p>
    <p class="gold">{{item.gold.total ? item.gold.total : ''}}</p>`
})

export class ItemComponent implements OnInit {
  @Input() item: Item;
  private xScaleTime = new TimeScale();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.item.time) {
      this.xScaleTime.create();
      this.el.nativeElement.setAttribute(
          'style', 'left: ' + this.xScaleTime.get()(this.item.time) + 'px');
    }
  }
}
