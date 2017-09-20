import {Component, Input, OnInit} from '@angular/core';

import {ReactiveComponent} from './reactive.component';

@Component({
  selector: 'lb-loading',
  template: `
    <ng-content *ngIf="!loading && !error"></ng-content>
    <lb-icon-load *ngIf="loading"></lb-icon-load>
    <lb-error [error]="error" [message]="errorMessage"></lb-error>`
})

export class LoadingComponent extends ReactiveComponent implements OnInit {
  loading = true;
  error = false;
  @Input() loadMessage: string;
  @Input() errorMessage = 'Something went wrong.. ';
  @Input() observable;

  constructor() {
    super();
  }

  ngOnInit() {
    this.observable.takeUntil(this.takeUntilDestroyed$)
        .subscribe(
            () => {
              this.loading = false;
            },
            () => {
              this.loading = false;
              this.error = true;
            });
  }
}
