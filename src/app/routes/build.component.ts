import {Component, ViewEncapsulation} from '@angular/core';
import {RouteSegment} from '@angular/router';

import {GraphComponent} from '../build/graph.component';
import {ItemsComponent} from '../build/items/items.component';
import {MasteriesComponent} from '../build/masteries/masteries.component';
import {ShopComponent} from '../build/shop/shop.component';

import {DDragonDirective} from '../misc/ddragon.directive';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';

import {LolApiService} from '../misc/lolapi.service';

import {Config} from '../build/config';

@Component({
  providers: [LolApiService],
  directives: [GraphComponent, ItemsComponent, MasteriesComponent, ShopComponent, DDragonDirective, LoadingComponent, ErrorComponent],
  styles: [
    require('../../assets/css/build.css')
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="title">
      <img *ngIf="champion" [ddragon]="'champion/' + champion?.image?.full">
      <h2>{{champion?.name}}</h2>
    </div>
    <graph [champion]="champion" [config]="config"></graph>
    <masteries></masteries>
    <items [config]="config" #items></items>
    <shop (itemPicked)="items.addItem($event)"></shop>
    <loading [loading]="loading"></loading>
    <error [error]="error" (retry)="getData()"></error>`
})

export class BuildComponent {
  private championKey: string;
  private champion: any;
  private loading: boolean = true;
  private error: boolean = false;

  private config: Config = new Config();
  private pickedItems: Array<Object>;

  constructor(routeSegment: RouteSegment, private lolApi: LolApiService) {
    this.championKey = routeSegment.getParam('champion');
    this.getData();

    let summoner: string = routeSegment.getParam('summoner');
    this.getMatchData(summoner);
  }

  getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampion(this.championKey)
      .subscribe(
      res => this.champion = res,
      error => { this.error = true; this.loading = false; },
      () => { this.loading = false; }
      );
  }

  getMatchData(value: string) {
    this.lolApi.getMatchData(value, this.championKey, this.config.gameTime, this.config.sampleSize)
      .subscribe(
        res => {
          this.config = new Config();
          this.config.xp = res.xp;
          this.config.g = res.g;
        },
        error => { this.error = true; }
      );
  }
}
