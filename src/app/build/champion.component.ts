import {Component} from 'angular2/core';
import {NgIf} from 'angular2/common'
import {RouteParams} from 'angular2/router';

import {GraphComponent} from '../misc/graph.component';
import {MasteriesComponent} from './masteries.component';

import {DDragonDirective} from '../misc/ddragon.directive';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';

import {LolApiService} from '../misc/lolapi.service';

import {Config} from './config';

@Component({
  selector: 'champion',
  directives: [GraphComponent, MasteriesComponent, DDragonDirective, LoadingComponent, ErrorComponent],
  providers: [LolApiService],
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
    <loading [loading]="loading"></loading>
    <error [error]="error" (retry)="getData()"></error>`
})

export class ChampionComponent {
  private championKey: string;
  private champion: any;
  private loading: boolean = true;
  private error: boolean = false;

  private config: Config = new Config();

  constructor(params: RouteParams, private lolApi: LolApiService) {
    this.championKey = params.get('champion');
    this.getData();
  }

  getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampion(this.championKey)
      .subscribe(
      res => this.champion = res.json(),
      error => { this.error = true; this.loading = false; },
      () => { this.loading = false; }
      );
  }

  getSummonerMatchData(value) {
    this.lolApi.getSummonerMatchData(value, this.championKey, this.config.gameTime, this.config.sampleSize)
      .subscribe(res => {
        this.config = new Config();
        this.config.xp = res.xp;
        this.config.g = res.g;
      });
  }
}