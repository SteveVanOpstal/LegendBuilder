/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, Output, EventEmitter} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';

import {AbilitiesComponent} from 'app/abilities';
import {StatsComponent} from 'app/stats';

import {LolApi} from 'app/lolApi';
import {ErrorComponent} from 'app/error';

@Component({
  selector: 'champion',
  providers: [LolApi]
})
@View({
  templateUrl: '/html/build/champion.html',
  directives: [AbilitiesComponent, StatsComponent, ErrorComponent]
})

export class ChampionComponent {
  @Output() dataReady: EventEmitter = new EventEmitter();
  private champion: any;
  private loading: boolean = true;
  private ok: boolean = true;
  
  constructor(params: RouteParams, private lolApi: LolApi) {
    this.getData(params.get('champion'));
  }
  
  getData(championName: string) {
    this.champion = { image: {full: null}, spells: null, name:null };
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getChampion(championName)
      .subscribe(
        res => this.champion = res.json(),
        error => { this.ok = false; this.loading = false; },
        () => { this.loading = false; this.dataReady.next(this.champion); }
      );
  }
}