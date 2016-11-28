import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services/lolapi.service';
import {ToIterablePipe} from '../shared/to-iterable.pipe';

import {NamePipe} from './pipes/name.pipe';
import {SortPipe} from './pipes/sort.pipe';
import {TagsPipe} from './pipes/tags.pipe';

@Component({
  selector: 'lb-champion',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./champion.css').toString()],
  template: `
    <lb-filters [(name)]="name" [(tags)]="tags" [(sort)]="sort" (enterHit)="enterHit()">
    </lb-filters>
    <div class="champion" *ngFor="let champion of champions?.data
                                  | lbToIterable
                                  | lbName:name
                                  | lbSort:sort
                                  | lbTags:tags">
      <a id="{{champion.id}}" [routerLink]="[champion.key]" *ngIf="!loading">
        <img class="nodrag" [lbDDragon]="'champion/loading/' + champion.key + '_0.jpg'">
        <div class="info">
          <p class="nodrag noselect">{{champion.name}}</p>
          <lb-bar title="Attack Damage" class="attack"  [value]="champion.info.attack"></lb-bar>
          <lb-bar title="Ability Power" class="magic"   [value]="champion.info.magic"></lb-bar>
          <lb-bar title="Defense"       class="defense" [value]="champion.info.defense"></lb-bar>
          <lb-bar title="Difficulty" class="difficulty" [value]="champion.info.difficulty"></lb-bar>
        </div>
      </a>
    </div>
    <lb-loading [loading]="loading"></lb-loading>
    <lb-retry [error]="error" (retry)="ngOnInit()"></lb-retry>`
})

export class ChampionComponent implements OnInit {
  champions: Array<Object>;
  loading: boolean = true;
  error: boolean = false;

  name: string;
  sort: string;
  tags: Array<string> = [];

  constructor(
      private route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {}

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampions().subscribe(
        res => {
          this.champions = res;
          this.loading = false;
        },
        () => {
          this.error = true;
          this.loading = false;
        });
  }

  enterHit() {
    let filteredChampions: any = this.filter(this.champions, this.name, this.sort, this.tags);
    if (filteredChampions && filteredChampions.length === 1) {
      this.router.navigate([filteredChampions[0].key], {relativeTo: this.route}).catch(() => {
        this.error = true;
      });
    }
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
