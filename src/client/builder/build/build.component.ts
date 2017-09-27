import {Component} from '@angular/core';

import {BuildSandbox} from './build.sandbox';

import {ItemsComponent} from './items/items.component';
import {ShopComponent} from './shop/shop.component';

@Component({
  selector: 'lb-build',
  styleUrls: ['./build.component.scss'],
  template: `
    <div class="content">
      <div class="title" *ngIf="sb.champion$ | async as c">
        <img [attr.alt]="c?.name"
             [attr.src]="'champion/' + c?.image?.full | lbDDragon">
        <h2>{{ c.name }}</h2>
      </div>
      <lb-loading [observable]="sb.champion$">
        <lb-graph></lb-graph>
        <!--<lb-abilities></lb-abilities>
        <lb-masteries></lb-masteries>-->
        <lb-items (itemSelected)="shop.selectItem($event)" #items></lb-items>
        <lb-shop #shop></lb-shop>
      </lb-loading>
    </div>`
})

export class BuildComponent {
  items: ItemsComponent;
  shop: ShopComponent;

  constructor(public sb: BuildSandbox) {}
}
