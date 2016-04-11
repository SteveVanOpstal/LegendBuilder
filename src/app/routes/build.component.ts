import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteParams} from 'angular2/router';

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
  styleUrls: [
    './assets/css/build.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="title">
      <img *ngIf="champion" [ddragon]="'champion/' + champion?.image?.full">
      <h2>{{champion?.name}}</h2>
    </div>
    <div>
      <p>Summoner:<input type="text" name="name" #name><button (click)="getSummonerMatchData(name.value)">Get</button></p>
    </div>
    <graph [champion]="champion" [config]="config"></graph>
    <masteries></masteries>
    <items [items]="pickedItems" [config]="config"></items>
    <shop [(pickedItems)]="pickedItems"></shop>
    <loading [loading]="loading"></loading>
    <error [error]="error" (retry)="getData()"></error>`
})

export class BuildComponent {
  private championKey: string;
  private champion: any;
  private loading: boolean = true;
  private error: boolean = false;

  private config: Config = new Config();
  private pickedItems: Array<Object> = new Array<Object>();

  constructor(params: RouteParams, private lolApi: LolApiService) {
    this.championKey = params.get('champion');
    this.getData();

    let summoner: string = params.get('summoner');
    let summonerId: any = params.get('summonerId');

    if (!summonerId || isNaN(summonerId)) {
      this.getSummonerMatchData(summoner);
    } else {
      this.getMatchData(parseInt(summonerId));
    }
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

  getMatchData(summonerId: number) {
    this.lolApi.getMatchData(summonerId, this.championKey, this.config.gameTime, this.config.sampleSize)
      .subscribe(
      res => {
        this.config = new Config();
        this.config.xp = res.xp;
        this.config.g = res.g;
      },
      error => { this.error = true; }
      );
  }

  getSummonerMatchData(value: string) {
    this.lolApi.getSummonerMatchData(value, this.championKey, this.config.gameTime, this.config.sampleSize)
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
