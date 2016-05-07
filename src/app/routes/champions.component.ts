import {Component, ViewEncapsulation} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {Router, RouteSegment} from '@angular/router';

import {ToIterablePipe} from '../misc/to-iterable.pipe';
import {NamePipe} from '../champions/pipes/name.pipe';
import {SortPipe} from '../champions/pipes/sort.pipe';
import {TagsPipe} from '../champions/pipes/tags.pipe';

import {FiltersComponent} from '../champions/filters.component';
import {BarComponent} from '../misc/bar.component';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';
import {DDragonDirective} from '../misc/ddragon.directive';

import {LolApiService} from '../misc/lolapi.service';

@Component({
  selector: 'champions',
  pipes: [ToIterablePipe, NamePipe, SortPipe, TagsPipe],
  providers: [LolApiService],
  directives: [NgFor, NgIf, FiltersComponent, BarComponent, LoadingComponent, ErrorComponent, DDragonDirective],
  styleUrls: [
    './assets/css/champions.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <filters [(name)]="name" [(tags)]="tags" [(sort)]="sort" (enterHit)="enterHit()"></filters>
    <div class="champion" *ngFor="let champion of champions?.data | toIterable | name:name | sort:sort | tags:tags">
      <a id="{{champion.id}}" [routerLink]="[champion.key]" *ngIf="!loading">
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

  constructor(current: RouteSegment, private router: Router, public lolApi: LolApiService) {
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
      this.router.navigate([filteredChampions[0]['key'], 'build']);
    }
  }

  private filter(champions: Array<Object>, name: string, sort: string, tags: Array<string>): Array<Object> {
    let toIterablePipe = new ToIterablePipe();
    let filteredChampions = toIterablePipe.transform(champions['data']);
    let namePipe = new NamePipe();
    filteredChampions = namePipe.transform(filteredChampions, name);
    let sortPipe = new SortPipe();
    filteredChampions = sortPipe.transform(filteredChampions, sort);
    let tagsPipe = new TagsPipe();
    filteredChampions = tagsPipe.transform(filteredChampions, tags);

    return filteredChampions;
  }
}
