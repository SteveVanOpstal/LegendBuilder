import {NgIf} from '@angular/common';
import {Component, ElementRef, Input} from '@angular/core';

import {DDragonDirective} from '../../misc/ddragon.directive';
import {TimeScale} from '../graph/axes/time';
import {Item} from '../item';

@Component({
  selector: 'item',
  directives: [NgIf, DDragonDirective],
  template: `
    <img [ddragon]="'item/' + item.image.full">
    <p *ngIf="item.bundle > 1" class="bundle">x{{item.bundle}}</p>
    <p class="gold">{{item.gold.total ? item.gold.total : ''}}</p>`
})

export class ItemComponent {
  @Input() item: Item;
  private xScaleTime = new TimeScale();

  constructor(el: ElementRef) {
    this.xScaleTime.create();
    el.nativeElement.setAttribute('style', 'left: ' + this.xScaleTime.get()(this.item.time) + 'px');
  }
}
