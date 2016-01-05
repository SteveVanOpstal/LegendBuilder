/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Output, EventEmitter} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {AbilitiesComponent} from 'app/abilities.component';
import {StatsComponent} from 'app/stats.component';
import {ErrorComponent} from 'app/error.component';

import {LolApiService} from 'app/lolapi.service';

@Component({
  selector: 'champion',
  providers: [LolApiService],
  templateUrl: '/html/build/champion.component.html',
  directives: [AbilitiesComponent, StatsComponent, ErrorComponent]
})

export class ChampionComponent {
  @Output() dataReady: EventEmitter = new EventEmitter();
  private champion: any;
  private loading: boolean = true;
  private ok: boolean = true;
  
  constructor(params: RouteParams, private lolApi: LolApiService) {
    this.getData(params.get('champion'));
  }
  
  getData(championName: string) {
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