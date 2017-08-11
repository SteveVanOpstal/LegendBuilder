import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {LolApiService} from '../services';
import {ItemsComponent} from './items/items.component';
import {ShopComponent} from './shop/shop.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  styles: [require('./build.css').toString()],
  template: `
    <div class="title">
      <img *ngIf="champion"
          [attr.alt]="champion?.name"
          [attr.src]="'champion/' + champion?.image?.full | lbDDragon">
      <h2>{{ champion?.name }}</h2>
    </div>
    <lb-loading [observable]="lolApi.getCurrentChampion()">
      <lb-graph></lb-graph>
      <!--<lb-abilities></lb-abilities>
      <lb-masteries></lb-masteries>-->
      <lb-items (itemSelected)="shop.selectItem($event)" #items></lb-items>
      <lb-shop #shop></lb-shop>
    </lb-loading>`
})

export class BuildComponent implements OnInit {
  items: ItemsComponent;
  shop: ShopComponent;
  champion: any;

  constructor(public lolApi: LolApiService) {}

  ngOnInit() {
    this.lolApi.getCurrentChampion().subscribe(champion => this.champion = champion);
  }
}
