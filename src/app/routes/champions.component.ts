import {Component, ViewEncapsulation} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {Router, RouterLink, RouteParams} from 'angular2/router';

import {ToIterablePipe} from '../misc/to-iterable.pipe';
import {NamePipe} from '../choose/name.pipe';
import {SortPipe} from '../choose/sort.pipe';
import {TagsPipe} from '../choose/tags.pipe';

import {FiltersComponent} from '../choose/filters.component';
import {BarComponent} from '../misc/bar.component';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';
import {DDragonDirective} from '../misc/ddragon.directive';

import {LolApiService} from '../misc/lolapi.service';

@Component({
  selector: 'champions',
  pipes: [ToIterablePipe, NamePipe, SortPipe, TagsPipe],
  providers: [LolApiService],
  directives: [NgFor, NgIf, RouterLink, FiltersComponent, BarComponent, LoadingComponent, ErrorComponent, DDragonDirective],
  styleUrls: [
    './assets/css/choose.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <filters [(name)]="name" [(tags)]="tags" [(sort)]="sort" (enterHit)="enterHit()"></filters>
    <div class="champion" *ngFor="#champion of champions?.data | toIterable | name:name | sort:sort | tags:tags">
      <a id="{{champion.id}}" [routerLink]="['../Features', {region: region, champion: champion.key}]" *ngIf="!loading">
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
  private sort: string;
  private tags: Array<string> = [];

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
    let filteredChampions = this.filter(this.champions, this.name, this.sort, this.tags);
    if (filteredChampions && filteredChampions.length === 1) {
      this.router.navigate(['../Build', { region: this.region, champion: filteredChampions[0]['key'] }]);
    }
  }

  private filter(champions: Array<Object>, name: string, sort: string, tags: Array<string>): Array<Object> {
    let toIterablePipe = new ToIterablePipe();
    let filteredChampions = toIterablePipe.transform(champions['data']);
    let namePipe = new NamePipe();
    filteredChampions = namePipe.transform(filteredChampions, [name]);
    let sortPipe = new SortPipe();
    filteredChampions = sortPipe.transform(filteredChampions, [sort]);
    let tagsPipe = new TagsPipe();
    filteredChampions = tagsPipe.transform(filteredChampions, [tags]);

    return filteredChampions;
  }
}
