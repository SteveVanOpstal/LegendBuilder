import {Component, ViewEncapsulation} from 'angular2/core';
import {Router, RouterLink, RouteParams} from 'angular2/router';

import {LolApiService} from '../misc/lolapi.service';

@Component({
  directives: [RouterLink],
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
    </div>`
})

export class FeaturesComponent {
  private region: string;
  private champion: string;
  private error: boolean = false;

  constructor(params: RouteParams, private router: Router, private lolApi: LolApiService) {
    this.region = params.get('region');
    this.champion = params.get('champion');
  }

  getSummonerId(event: HTMLInputElement) {
    this.lolApi.getSummonerId(event.value, this.champion)
      .subscribe(
        res => {
          if (res) {
            this.router.navigate(['../BuildSummoner', { region: this.region, champion: this.champion, summoner: event.value, summonerId: res }]);
          } else {
            this.error = true;
          }
        },
        error => { this.error = true; }
      );
  }
}
