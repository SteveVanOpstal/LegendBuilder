import {Component} from '@angular/core';

import {BuildSandbox} from './build.sandbox';
import {InventoryComponent} from './inventory/inventory.component';
import {PickedItemsService} from './services/picked-items.service';
import {QueryService} from './services/query.service';
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
        <lb-inventory (itemSelected)="shop.selectItem($event)" #items></lb-inventory>
        <lb-shop #shop></lb-shop>
      </lb-loading>
    </div>`
})

export class BuildComponent {
  items: InventoryComponent;
  shop: ShopComponent;

  constructor(
      public sb: BuildSandbox, public query: QueryService, public pickedItem: PickedItemsService) {}
}
