/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Output, EventEmitter} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {GraphComponent} from 'app/graph.component';
import {MasteryComponent} from 'app/mastery.component';

import {ErrorComponent} from 'app/error.component';
import {DDragonDirective} from 'app/ddragon.directive';

import {LolApiService} from 'app/lolapi.service';

import {Config} from 'app/config';

@Component({
  selector: 'champion',
  template: `
    <div class="title">
      <img [ddragon]="'champion/' + champion?.image?.full">
      <h2>{{champion?.name}}</h2>
    </div>
    <div>
      <p>Summoner:<input type="text" name="name" #name><button (click)="getSummonerMatchData(name.value)">Get</button></p>
    </div>
    <graph [champion]="champion" [config]="config"></graph>
    <mastery></mastery>
    <error [loading]="loading" [ok]="ok" (retry)="getData()"></error>`,
  directives: [GraphComponent, MasteryComponent, ErrorComponent, DDragonDirective],
  providers: [LolApiService]
})

export class ChampionComponent {
  private championKey: string;
  private champion: any;
  private loading: boolean = true;
  private ok: boolean = true;
  
  private config: Config = new Config();
  
  constructor(params: RouteParams, private lolApi: LolApiService) {
    this.championKey = params.get('champion');
    this.getData();
  }
  
  getData() {
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getChampion(this.championKey)
      .subscribe(
        res => this.champion = res.json(),
        error => { this.ok = false; this.loading = false; },
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