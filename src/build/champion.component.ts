/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Output, EventEmitter} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {ConfigComponent} from 'app/config.component'
import {AbilitiesComponent} from 'app/abilities.component';
import {StatsComponent} from 'app/stats.component';

import {ErrorComponent} from 'app/error.component';
import {DDragonImageComponent} from 'app/ddragonimage.component'

import {LolApiService} from 'app/lolapi.service';

@Component({
  selector: 'champion',
  templateUrl: '/html/build/champion.component.html',
  directives: [ConfigComponent, AbilitiesComponent, StatsComponent, ErrorComponent, DDragonImageComponent],
  providers: [LolApiService]
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