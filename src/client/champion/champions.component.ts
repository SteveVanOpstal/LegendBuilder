import {Component, OnInit, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services';

import {ChampionComponent} from './champion.component';

@Component({
  selector: 'lb-champions',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./champion.css').toString()],
  template: `
    <lb-filters [(tags)]="tags" [(name)]="name" [(sort)]="sort" (enterHit)="enterHit()">
    </lb-filters>
    <lb-champion *ngFor="let champion of champions
                        | toArray
                        | fuzzyBy:'name':name
                        | lbSort:sort
                        | lbTags:tags"
                 [champion]="champion">
    </lb-champion>
    <lb-loading [loading]="loading"></lb-loading>
    <lb-retry [error]="error" (retry)="ngOnInit()"></lb-retry>`
})

export class ChampionsComponent implements OnInit {
  champions: Object = {};
  loading: boolean = true;
  error: boolean = false;

  tags: Array<string> = [];
  name: string;
  sort: string = '';

  @ViewChildren(ChampionComponent) activeChampions: QueryList<ChampionComponent>;

  constructor(
      private route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {}

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampions().subscribe(
        res => {
          this.champions = res.data;
          this.loading = false;
        },
        () => {
          this.error = true;
          this.loading = false;
        });
  }

  enterHit() {
    if (this.activeChampions && this.activeChampions.length === 1) {
      this.router.navigate([this.activeChampions.first.champion.key], {relativeTo: this.route})
          .catch(() => {
            this.error = true;
          });
    }
  }
}
