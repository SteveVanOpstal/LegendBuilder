import {Component, Output, EventEmitter, Inject} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {Response} from 'angular2/http';
import {RouterLink, RouteParams} from 'angular2/router';

import {FilterPipe, FiltersComponent} from '../choose/filters.component';
import {BarComponent} from '../misc/bar.component';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';
import {DDragonDirective} from '../misc/ddragon.directive';

import {LolApiService} from '../misc/lolapi.service';

@Component({
  selector: 'champions',
  pipes: [FilterPipe],
  providers: [LolApiService],
  directives: [NgFor, NgIf, RouterLink, FiltersComponent, BarComponent, LoadingComponent, ErrorComponent, DDragonDirective],
  template: `
    <filters [tags]="tags"></filters>
    <div class="champion" *ngFor="#champion of champions?.data | filter:name:'defense':tags">
      <a id="{{champion.id}}" [routerLink]="['../Build', {region: region, champion: champion.key}]" *ngIf="!loading">
        <img class="nodrag" [ddragon]="'champion/loading/' + champion.key + '_0.jpg'">
        <div class="info">
          <p class="nodrag noselect">{{champion.name}}</p>
          <bar title="Attack damage" class="attack"     [value]="champion.info.attack"></bar>
          <bar title="Ability Power" class="magic"      [value]="champion.info.magic"></bar>
          <bar title="Defense"       class="defense"    [value]="champion.info.defense"></bar>
          <bar title="Difficulty"    class="difficulty" [value]="champion.info.difficulty"></bar>
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

  private tags: Array<string> = [];
  private sort: Object = Object();

  constructor(params: RouteParams, public lolApi: LolApiService) {
    this.region = params.get('region');
    this.getData();
  }

  private getData() {
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
