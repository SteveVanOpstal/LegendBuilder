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
        <input type="text" name="name" #summoner (keyup.enter)="getAccountId(summoner)">
        <button (click)="getAccountId(summoner)">Go</button>
      </p>
      <lb-error [error]="error" [message]="'Summoner does not exist'"></lb-error>
      <lb-icon-load *ngIf="loading"></lb-icon-load>
    </div>`
})

export class SummonerComponent {
  error: boolean = false;
  loading: boolean = false;

  constructor(
      private route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {}

  getAccountId(event: HTMLInputElement) {
    this.loading = true;
    this.lolApi.getAccountId(event.value)
        .subscribe(
            res => {
              if (!isNaN(res)) {
                this.router.navigate([event.value], {relativeTo: this.route}).catch(() => {
                  this.loading = false;
                  this.error = true;
                });
              } else {
                this.loading = false;
                this.error = true;
              }
            },
            () => {
              this.loading = false;
              this.error = true;
            });
  }
}
