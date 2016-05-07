import {Component, ViewEncapsulation} from '@angular/core';
import {Router, RouteSegment} from '@angular/router';

import {LolApiService} from '../misc/lolapi.service';

@Component({
  directives: [],
  providers: [LolApiService],
  styleUrls: [
    './assets/css/summoner.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div>
      <p>
        Enter your summoner name:
        <input type="text" name="name" #summoner>
        <button (click)="getSummonerId(summoner)">Go</button>
      </p>
      <p>
        Universal build
        <button>
          <a [routerLink]="['/Build', region.id, champion]"></a>
        </button>
      </p>
    </div>`
})

export class FeaturesComponent {
  private region: string;
  private champion: string;
  private error: boolean = false;

  constructor(current: RouteSegment, private router: Router, private lolApi: LolApiService) {
    this.region = current.getParam('region');
    this.champion = current.getParam('champion');
  }

  getSummonerId(event: HTMLInputElement) {
    this.lolApi.getSummonerId(event.value, this.champion)
      .subscribe(
        res => {
          if (!isNaN(res)) {
            this.router.navigate([this.region, this.champion, 'summoner', event.value ]);
          } else {
            this.error = true;
          }
        },
        error => { this.error = true; }
      );
  }
}
