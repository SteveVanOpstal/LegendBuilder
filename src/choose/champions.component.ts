/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Output, EventEmitter, Inject} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {Response} from 'angular2/http';
import {RouterLink, RouteParams} from 'angular2/router';

import {LolApiService} from 'app/lolapi.service';
import {ErrorComponent} from 'app/error.component';

import {DDragonDirective} from 'app/ddragon.directive';
import {BarComponent} from 'app/bar.component'

@Component({
  selector: 'champions',
  providers: [LolApiService],
  template: `
    <div class="champion" *ngFor="#champion of champions?.data">
      <a id="{{champion.id}}" [routerLink]="['../Build', {region: region, champion: champion.key}]" *ngIf="!loading">
        <img class="nodrag" [ddragon]="'champion/loading/' + champion.key + '_0.jpg'">
        <div class="info">
          <p class="nodrag noselect">{{champion.name}}</p>
          <bar title="Attack damage"    class="attack"     [value]="champion.info.attack"></bar>
          <bar title="Health"           class="defense"    [value]="champion.info.defense"></bar>
          <bar title="Ability Power"    class="magic"      [value]="champion.info.magic"></bar>
          <bar title="Difficulty"       class="difficulty" [value]="champion.info.difficulty"></bar>
        </div>
      </a>
    </div>
    <error [loading]="loading" [ok]="ok" (retry)="getData()"></error>`,
  directives: [NgFor, NgIf, RouterLink, ErrorComponent, DDragonDirective, BarComponent]
})

export class ChampionsComponent {
  @Output() championChanged: EventEmitter = new EventEmitter();
  
  private region : string;
  
  private champions : Object;
  private loading: boolean = true;
  private ok: boolean = true;

  constructor(params: RouteParams, public lolApi: LolApiService) {
    this.region = params.get('region');
    this.getData();
  }

  test(championKey: string)
  {
    this.championChanged.emit(championKey);
  }
  
  getData()
  {
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getChampions()
      .subscribe(
        res => this.champions = res.json(),
        error => {this.ok = false; this.loading = false;},
        () => this.loading = false
      );
  }
}