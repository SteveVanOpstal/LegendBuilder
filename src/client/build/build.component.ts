import {Component, ViewEncapsulation} from '@angular/core';
import {RouteSegment} from '@angular/router';

import {GraphComponent} from '../build/graph/graph.component';
import {ItemsComponent} from '../build/items/items.component';
import {MasteriesComponent} from '../build/masteries/masteries.component';
import {ShopComponent} from '../build/shop/shop.component';

import {DDragonDirective} from '../misc/ddragon.directive';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';

import {LolApiService} from '../misc/lolapi.service';

import {Samples} from '../build/samples';
import {settings} from '../../../config/settings';

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
    <graph [champion]="champion" [samples]="samples"></graph>
    <masteries></masteries>
    <items [samples]="samples" #items></items>
    <shop (itemPicked)="items.addItem($event)"></shop>
    <loading [loading]="loading"></loading>
    <error [error]="error" (retry)="getData()"></error>`
})

export class BuildComponent {
  private championKey: string;
  private champion: any;
  private loading: boolean = true;
  private error: boolean = false;

  private samples: Samples = { xp: [], gold: [] };
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
    this.lolApi.getMatchData(value, this.championKey, settings.gameTime, settings.sampleSize)
      .subscribe(
      res => {
        this.samples = { xp: [], gold: [] };
        this.samples = res;
        // this.samples.xp = res.xp;
        // this.samples.g = res.g;
      },
      error => { this.error = true; }
      );
  }
}
