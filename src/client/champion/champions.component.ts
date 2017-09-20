import {Component, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {ChampionComponent} from './champion.component';
import {ChampionsSandbox} from './champions.sandbox';

@Component({
  selector: 'lb-champions',
  styleUrls: ['./champions.component.scss'],
  template: `
    <div class="content">
      <lb-filters [(tags)]="tags" [(name)]="name" [(sort)]="sort" (enterHit)="enterHit()">
      </lb-filters>
      <lb-loading [observable]="sb.champions$">
        <lb-champion *ngFor="let champion of sb.champions$
                            | async
                            | fuzzyBy:'name':name
                            | lbSort:sort
                            | lbTags:tags"
                    [champion]="champion">
        </lb-champion>
      </lb-loading>
    </div>`
})

export class ChampionsComponent {
  tags: Array<string> = [];
  name: string;
  sort = '';

  @ViewChildren(ChampionComponent) activeChampions: QueryList<ChampionComponent>;

  constructor(private route: ActivatedRoute, private router: Router, public sb: ChampionsSandbox) {}

  enterHit() {
    if (this.activeChampions && this.activeChampions.length === 1) {
      this.router.navigate([this.activeChampions.first.champion.key], {relativeTo: this.route});
    }
  }
}
