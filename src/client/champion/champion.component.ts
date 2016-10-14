import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services/lolapi.service';
import {ToIterablePipe} from '../shared/to-iterable.pipe';

import {NamePipe} from './pipes/name.pipe';
import {SortPipe} from './pipes/sort.pipe';
import {TagsPipe} from './pipes/tags.pipe';

@Component({
  selector: 'champion',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./champion.css').toString()],
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
    <retry [error]="error" (retry)="getData()"></retry>`
})

export class ChampionComponent implements OnInit {
  private champions: Array<Object>;
  private loading: boolean = true;
  private error: boolean = false;

  private name: string;
  private sort: string;
  private tags: Array<string> = [];

  constructor(
      private route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {}

  ngOnInit() {
    this.getData();
  }

  enterHit() {
    let filteredChampions: any = this.filter(this.champions, this.name, this.sort, this.tags);
    if (filteredChampions && filteredChampions.length === 1) {
      this.router.navigate([filteredChampions[0].key], {relativeTo: this.route}).catch(() => {
        this.error = true;
      });
    }
  }

  private getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampions().subscribe(res => this.champions = res, error => {
      this.error = true;
      this.loading = false;
    }, () => this.loading = false);
  }

  private filter(champions: any, name: string, sort: string, tags: Array<string>): Array<Object> {
    let toIterablePipe = new ToIterablePipe();
    let filteredChampions = toIterablePipe.transform(champions.data);
    let namePipe = new NamePipe();
    filteredChampions = namePipe.transform(filteredChampions, name);
    let sortPipe = new SortPipe();
    filteredChampions = sortPipe.transform(filteredChampions, sort);
    let tagsPipe = new TagsPipe();
    filteredChampions = tagsPipe.transform(filteredChampions, tags);

    return filteredChampions;
  }
}
