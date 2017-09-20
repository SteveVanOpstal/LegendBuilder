import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchmap';

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';

import {tim} from '../shared/tim';

import {SummonerSandbox} from './summoner.sandbox';

const errors = {
  empty: 'Empty summoner name.',
  short: 'Summoner name [{{ name }}] is too short.',
  long: 'Summoner name [{{ name }}].. is too long.',
  invalid: 'Summoner name [{{ name }}] is invalid.',
  unkown: 'Summoner name is unknown.'
};

@Component({
  selector: 'lb-summoner',
  styleUrls: ['./summoner.component.scss'],
  template: `
    <div class="content">
      <div class="align-center">
        <label class="align-center">
          <h2>Enter your summoner name</h2>
          <div class="align-center">
            <input type="text" name="name" #name (keyup.enter)="name$.next(name.value)" autofocus>
            <button (click)="name$.next(name.value)">Go</button>
          </div>
        </label>
        <lb-error [error]="error" [message]="message"></lb-error>
        <lb-icon-load *ngIf="loading"></lb-icon-load>
      </div>
    </div>`
})

export class SummonerComponent {
  error = false;
  message: string;
  loading = false;

  name$ = new Subject<string>();

  constructor(private route: ActivatedRoute, private router: Router, private sb: SummonerSandbox) {
    this.name$
        .filter(name => {
          if (name.length <= 0) {
            this.setError(errors.empty, name);
            return false;
          }
          return true;
        })
        .filter(name => {
          if (name.length < 3) {
            this.setError(errors.short, name);
            return false;
          }
          return true;
        })
        .filter(name => {
          if (name.length > 16) {
            this.setError(errors.long, name);
            return false;
          }
          return true;
        })
        .filter(name => {
          if (!this.checkValid(name)) {
            this.setError(errors.invalid, name);
            return false;
          }
          return true;
        })
        .switchMap(
            name => this.sb.getAccountId(name),
            (inner, outer) => {
              return {name: inner, accountId: outer};
            })
        .subscribe(
            result => {
              if (!isNaN(result.accountId)) {
                this.router.navigate([result.name], {relativeTo: this.route}).catch(() => {
                  this.setError(errors.unkown, result.name);
                });
              } else {
                this.setError(errors.unkown, result.name);
              }
            },
            () => {
              this.setError(errors.unkown);
            });
  }

  setError(error: string, name?: string) {
    this.error = true;
    this.loading = false;
    if (name) {
      this.message = tim(error, {name: name.substr(0, 16)});
    } else {
      this.message = error;
    }
  }

  checkValid(name: string): boolean {
    return RegExp(
               /[ 0-9A-Za-zªµºÀ-ÖØ-öø-ÿĂ-ćĘęĞğİıŁ-ńŐ-œŚśŞ-ţŰűŸ-žƒȘ-țˆˇˉΑ-ΡΣ-Ωά-ία-ωό-ώЁА-яёﬁﬂ]/g)
        .test(name);
  }
}
