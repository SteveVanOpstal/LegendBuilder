import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {settings} from '../../../config/settings';
import {DDragonDirective} from '../misc/ddragon.directive';
import {ErrorComponent} from '../misc/error.component';
import {LoadingComponent} from '../misc/loading.component';
import {LolApiService} from '../misc/lolapi.service';

import {GraphComponent} from './graph/graph.component';
import {Item} from './item';
import {ItemsComponent} from './items/items.component';
import {MasteriesComponent} from './masteries/masteries.component';
import {Samples} from './samples';
import {ShopComponent} from './shop/shop.component';

require('../../assets/css/base.css');
require('../../assets/css/build.css');

@Component({
  providers: [LolApiService],
  directives: [
    GraphComponent, ItemsComponent, MasteriesComponent, ShopComponent, DDragonDirective,
    LoadingComponent, ErrorComponent
  ],
  template: `
    <div class="title">
      <img *ngIf="champion" [ddragon]="'champion/' + champion?.image?.full">
      <h2>{{champion?.name}}</h2>
    </div>
    <graph [champion]="champion" [samples]="samples" [pickedItems]="pickedItems"></graph>
    <masteries></masteries>
    <items [samples]="samples" [(pickedItems)]="pickedItems" #items></items>
    <shop (itemPicked)="items.addItem($event)"></shop>
    <loading [loading]="loading"></loading>
    <error [error]="error" (retry)="getData()"></error>`
})

export class BuildComponent implements OnInit {
  private championKey: string;
  private champion: any;
  private loading: boolean = true;
  private error: boolean = false;

  private samples: Samples = {xp: [], gold: []};
  private pickedItems: Array<Item>;

  constructor(private route: ActivatedRoute, private lolApi: LolApiService) {}

  ngOnInit() {
    this.championKey = this.route.snapshot.params['champion'];
    this.getData();

    let summoner = this.route.snapshot.params['summoner'];
    this.getMatchData(summoner);
  }

  getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampion(this.championKey)
        .subscribe(
            res => this.champion = res,
            error => {
              this.error = true;
              this.loading = false;
            },
            () => {
              this.loading = false;
            });
  }

  getMatchData(value: string) {
    this.lolApi
        .getMatchData(value, this.championKey, settings.gameTime, settings.matchServer.sampleSize)
        .subscribe(
            res => {
              this.samples = {xp: [], gold: []};
              this.samples = res;
              // this.samples.xp = res.xp;
              // this.samples.g = res.g;
            },
            error => {
              this.error = true;
            });
  }
}
