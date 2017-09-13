import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services';
import {tim} from '../shared/tim';

const errors = {
  empty: 'Empty summoner name.',
  short: 'Summoner name [{{ name }}] is too short.',
  long: 'Summoner name [{{ name }}].. is too long.',
  invalid: 'Summoner name [{{ name }}] is invalid.',
  unkown: 'Summoner name [{{ name }}] unknown.'
};

@Component({
  selector: 'lb-summoner',
  styleUrls: ['./summoner.component.scss'],
  template: `
    <div class="align-center">
      <label class="align-center">
        <h2>Enter your summoner name</h2>
        <div class="align-center">
          <input type="text" name="name" #name (keyup.enter)="getAccountId(name.value)">
          <button (click)="getAccountId(name.value)">Go</button>
        </div>
      </label>
      <lb-error [error]="error" [message]="message"></lb-error>
      <lb-icon-load *ngIf="loading"></lb-icon-load>
    </div>`
})

export class SummonerComponent {
  error = false;
  message: string;
  loading = false;

  constructor(
      private route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {}

  getAccountId(name: string) {
    this.error = false;
    this.loading = true;
    if (name.length <= 0) {
      this.setError(errors.empty, name);
      return;
    }
    if (name.length < 3) {
      this.setError(errors.short, name);
      return;
    }
    if (name.length > 16) {
      this.setError(errors.long, name);
      return;
    }
    if (!this.checkValid(name)) {
      this.setError(errors.invalid, name);
      return;
    }
    this.lolApi.getAccountId(name).subscribe(
        res => {
          if (!isNaN(res)) {
            this.router.navigate([name], {relativeTo: this.route}).catch(() => {
              this.setError(errors.unkown, name);
            });
          } else {
            this.setError(errors.unkown, name);
          }
        },
        () => {
          this.setError(errors.unkown, name);
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
