import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../misc/lolapi.service';

@Component({
  directives: [],
  providers: [LolApiService],
  encapsulation: ViewEncapsulation.None,
  styles: [],
  template: `
    <div>
      <p>
        Enter your summoner name:
        <input type="text" name="name" #summoner>
        <button (click)="getSummonerId(summoner)">Go</button>
      </p>
      <p>
        <button>
          <a [routerLink]="['build']">Universal build</a>
        </button>
      </p>
    </div>`
})

export class FeaturesComponent implements OnInit {
  private champion: string;
  private error: boolean = false;

  constructor(
      private route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.champion = params['champion'];
    });
  }

  getSummonerId(event: HTMLInputElement) {
    this.lolApi.getSummonerId(event.value, this.champion)
        .subscribe(
            res => {
              if (!isNaN(res)) {
                this.router.navigate(['summoner', event.value], {relativeTo: this.route})
                    .catch(() => {
                      this.error = true;
                    });
              } else {
                this.error = true;
              }
            },
            error => {
              this.error = true;
            });
  }
}
