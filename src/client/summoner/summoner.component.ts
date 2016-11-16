import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services/lolapi.service';

@Component({
  selector: 'lb-summoner',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./summoner.css').toString()],
  template: `
    <div class="align-center">
      <p>
        Enter your summoner name:
        <input type="text" name="name" #summoner>
        <button (click)="getSummonerId(summoner)">Go</button>
      </p>
      <p *ngIf="error">Error summoner does not exist</p>
    </div>`
})

export class SummonerComponent {
  private error: boolean = false;

  constructor(
      private route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {}

  getSummonerId(event: HTMLInputElement) {
    this.lolApi.getSummonerId(event.value)
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
            error => {
              this.error = true;
            });
  }
}
