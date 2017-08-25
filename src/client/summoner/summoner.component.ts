import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services';
import {tim} from '../shared/tim';

namespace Errors {
  export const short: string = 'Summoner name \'{{ name }}\' is too short.';
  export const long: string = 'Summoner name \'{{ name }}\'.. is too long.';
  export const invalid: string = 'Summoner name \'{{ name }}\' is invalid.';
  export const unkown: string = 'Summoner name \'{{ name }}\' unknown.';
}

@Component({
  selector: 'lb-summoner',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./summoner.css').toString()],
  template: `
    <div class="align-center">
      <p>
        Enter your summoner name:
        <input type="text" name="name" #name (keyup.enter)="getAccountId(name.value)">
        <button (click)="getAccountId(name.value)">Go</button>
      </p>
      <lb-error [error]="error" [message]="message"></lb-error>
      <lb-icon-load *ngIf="loading"></lb-icon-load>
    </div>`
})

export class SummonerComponent {
  error: boolean = false;
  message: string;
  loading: boolean = false;

  constructor(
      private route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {}

  getAccountId(name: string) {
    this.error = false;
    this.loading = true;
    if (name.length < 3) {
      this.setError(Errors.short, name);
      return;
    }
    if (name.length > 16) {
      this.setError(Errors.long, name);
      return;
    }
    if (!this.checkValid(name)) {
      this.setError(Errors.invalid, name);
      return;
    }
    this.lolApi.getAccountId(name).subscribe(
        res => {
          if (!isNaN(res)) {
            this.router.navigate([name], {relativeTo: this.route}).catch(() => {
              this.setError(Errors.unkown, name);
            });
          } else {
            this.setError(Errors.unkown, name);
          }
        },
        () => {
          this.setError(Errors.unkown, name);
        });
  }

  setError(error: string, name: string) {
    this.error = true;
    this.loading = false;
    this.message = tim(error, {name: name.substr(0, 16)});
  }

  checkValid(name: string): boolean {
    return RegExp(
               /[ 0-9A-Za-zªµºÀ-ÖØ-öø-ÿĂ-ćĘęĞğİıŁ-ńŐ-œŚśŞ-ţŰűŸ-žƒȘ-țˆˇˉΑ-ΡΣ-Ωά-ία-ωό-ώЁА-яёﬁﬂ]/g)
        .test(name);
  }
}
