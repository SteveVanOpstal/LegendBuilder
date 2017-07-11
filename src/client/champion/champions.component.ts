import {Component, OnInit, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services';

import {ChampionComponent} from './champion.component';

@Component({
  selector: 'lb-champions',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./champion.css').toString()],
  template: `
    <lb-loading [observable]="lolApi.getChampions()">
      <lb-filters [(tags)]="tags" [(name)]="name" [(sort)]="sort" (enterHit)="enterHit()">
      </lb-filters>
      <lb-champion *ngFor="let champion of champions
                          | toArray
                          | fuzzyBy:'name':name
                          | lbSort:sort
                          | lbTags:tags"
                  [champion]="champion">
      </lb-champion>
    </lb-loading>`
})

export class ChampionsComponent implements OnInit {
  champions: Object = {};

  tags: Array<string> = [];
  name: string;
  sort: string = '';

  @ViewChildren(ChampionComponent) activeChampions: QueryList<ChampionComponent>;

  constructor(private route: ActivatedRoute, private router: Router, public lolApi: LolApiService) {
  }

  ngOnInit() {
    this.lolApi.getChampions().subscribe(res => {
      this.champions = res.data;
    });
  }

  enterHit() {
    if (this.activeChampions && this.activeChampions.length === 1) {
      this.router.navigate([this.activeChampions.first.champion.key], {relativeTo: this.route});
    }
  }
}
