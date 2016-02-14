/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Output, EventEmitter} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {LineGraphComponent} from 'app/line-graph.component';
import {AbilitiesComponent} from 'app/abilities.component';

import {ErrorComponent} from 'app/error.component';
import {DDragonDirective} from 'app/ddragon.directive';

import {LolApiService} from 'app/lolapi.service';

import {Config} from 'app/config';

@Component({
  selector: 'champion',
  templateUrl: '/html/build/champion.component.html',
  directives: [LineGraphComponent, AbilitiesComponent, ErrorComponent, DDragonDirective],
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