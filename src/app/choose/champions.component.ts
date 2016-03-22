import {Component, Output, EventEmitter, Inject, ViewChildren} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {Response} from 'angular2/http';
import {Router, RouterLink, RouteParams} from 'angular2/router';

import {FilterPipe, FiltersComponent} from '../choose/filters.component';
import {BarComponent} from '../misc/bar.component';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';
import {DDragonDirective} from '../misc/ddragon.directive';
import {ToIterablePipe} from '../misc/to-iterable.pipe';

import {LolApiService} from '../misc/lolapi.service';

@Component({
  selector: 'champions',
  pipes: [ToIterablePipe, FilterPipe],
  providers: [LolApiService],
  directives: [NgFor, NgIf, RouterLink, FiltersComponent, BarComponent, LoadingComponent, ErrorComponent, DDragonDirective],
  template: `
    <filters [(name)]="name" [(tags)]="tags" [(sort)]="sort" (enterHit)="enterHit()"></filters>
    <div class="champion" *ngFor="#champion of champions?.data | toIterable | filter:name:sort:tags">
      <a id="{{champion.id}}" [routerLink]="['../Build', {region: region, champion: champion.key}]" *ngIf="!loading">
        <img class="nodrag" [ddragon]="'champion/loading/' + champion.key + '_0.jpg'">
        <div class="info">
          <p class="nodrag noselect">{{champion.name}}</p>
          <bar title="Attack Damage" class="attack"     [value]="champion.info.attack"></bar>
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

  private champions: Array<Object>;
  private loading: boolean = true;
  private error: boolean = false;

  private name: string;
  private tags: Array<string> = [];
  private sort: string;

  constructor(params: RouteParams, private router: Router, public lolApi: LolApiService) {
    this.region = params.get('region');
    this.getData();
  }

  private getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampions()
      .subscribe(
      res => this.champions = res,
      error => { this.error = true; this.loading = false; },
      () => this.loading = false
      );
  }

  private enterHit() {
    var filterPipe = new FilterPipe();
    var toIterablePipe = new ToIterablePipe();
    var filteredChampions = filterPipe.transform(toIterablePipe.transform(this.champions['data']), [this.name, this.tags, this.sort]);
    if (filteredChampions.length === 1) {
      this.router.navigate(['../Build', { region: this.region, champion: filteredChampions[0]['key'] }]);
    }
  }
}
