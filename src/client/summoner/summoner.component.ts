import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchmap';
import 'rxjs/add/operator/do';

import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';

import {ReactiveComponent} from '../shared/reactive.component';

import {SummonerSandbox} from './summoner.sandbox';

@Component({
  selector: 'lb-summoner',
  styleUrls: ['./summoner.component.scss'],
  template: `
    <div class="content">
      <div class="align-center">
        <label class="align-center">
          <h2>Enter your summoner name</h2>
          <form class="align-center" [formGroup]="nameForm" (ngSubmit)="submit$.next(nameForm.value['name'])">
            <input type="text" name="name" formControlName="name" maxLength="16" autofocus>
            <button type="submit">Go</button>
          </form>
        </label>
        <lb-error [error]="nameForm.controls.name.errors?.minlength" [message]="'Summoner name is too short.'"></lb-error>
        <lb-error [error]="nameForm.controls.name.errors?.pattern"
                  [message]="'Invalid character ' + getInvalidCharacters(nameForm.value['name']) + '.'">
        </lb-error>
        <lb-error [error]="unknown" [message]="'Summoner name is unknown.'"></lb-error>
        <lb-icon-load *ngIf="loading"></lb-icon-load>
      </div>
    </div>`
})

export class SummonerComponent extends ReactiveComponent {
  nameForm: FormGroup;
  unknown = false;
  loading = false;
  submit$ = new Subject<any>();

  private pattern =
      '[ 0-9A-Za-zªµºÀ-ÖØ-öø-ÿĂ-ćĘęĞğİıŁ-ńŐ-œŚśŞ-ţŰűŸ-žƒȘ-țˆˇˉΑ-ΡΣ-Ωά-ία-ωό-ώЁА-яёﬁﬂ]*';

  constructor(
      private route: ActivatedRoute, private router: Router, private sb: SummonerSandbox,
      private fb: FormBuilder) {
    super();
    this.nameForm = this.fb.group({
      name: [
        '',
        [
          Validators.pattern(this.pattern),
          Validators.minLength(3),
          Validators.maxLength(16),
        ]
      ]
    });

    this.submit$
        .do(() => {
          this.unknown = false;
          this.loading = true;
        })
        .switchMap(
            name => this.sb.getAccountId(name),
            (inner, outer) => {
              return {name: inner, accountId: outer};
            })
        .takeUntil(this.takeUntilDestroyed$)
        .subscribe(result => {
          if (!isNaN(result.accountId)) {
            this.router.navigate([result.name], {relativeTo: this.route})
                .catch(() => this.handleError());
          } else {
            this.handleError();
          }
        }, () => this.handleError());
  }

  handleError() {
    this.unknown = true;
    this.loading = false;
  }

  getInvalidCharacters() {
    const regex =
        /((?![ 0-9A-Za-zªµºÀ-ÖØ-öø-ÿĂ-ćĘęĞğİıŁ-ńŐ-œŚśŞ-ţŰűŸ-žƒȘ-țˆˇˉΑ-ΡΣ-Ωά-ία-ωό-ώЁА-яёﬁﬂ]).)/g;
    const matches = this.nameForm.controls.name.value.match(regex);
    return Array.from(new Set(matches)).join('');
  }
}
