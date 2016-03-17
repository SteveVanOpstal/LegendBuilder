import {Component, Output, EventEmitter, Inject} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {Response} from 'angular2/http';
import {RouterLink, RouteParams} from 'angular2/router';

import {DDragonDirective} from '../misc/ddragon.directive';
import {BarComponent} from '../misc/bar.component';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';

import {LolApiService} from '../misc/lolapi.service';

@Component({
  selector: 'champions',
  providers: [LolApiService],
  directives: [NgFor, NgIf, RouterLink, DDragonDirective, BarComponent, LoadingComponent, ErrorComponent],
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
    <loading [loading]="loading"></loading>
    <error [error]="error" (retry)="getData()"></error>`
})

export class ChampionsComponent {
  private region: string;

  private champions: Object;
  private loading: boolean = true;
  private error: boolean = false;

  constructor(params: RouteParams, public lolApi: LolApiService) {
    this.region = params.get('region');
    this.getData();
  }

  getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampions()
      .subscribe(
      res => this.champions = res.json(),
      error => { this.error = true; this.loading = false; },
      () => this.loading = false
      );
  }
}
