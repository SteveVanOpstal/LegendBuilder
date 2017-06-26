import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services';

@Component({
  selector: 'lb-summoner',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./summoner.css').toString()],
  template: `
    <div class="align-center">
      <p>
        Enter your summoner name:
        <input type="text" name="name" #summoner>
        <button (click)="getAccountId(summoner)">Go</button>
      </p>
      <p *ngIf="error">Error summoner does not exist</p>
    </div>`
})

export class SummonerComponent {
  error: boolean = false;

  constructor(
      private route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {}

  getAccountId(event: HTMLInputElement) {
    this.lolApi.getAccountId(event.value)
        .subscribe(
            res => {
              if (!isNaN(res)) {
                this.router.navigate([event.value], {relativeTo: this.route}).catch(() => {
                  this.error = true;
                });
              } else {
                this.error = true;
              }
            },
            () => {
              this.error = true;
            });
  }
}
