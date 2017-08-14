import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'lb-loading',
  template: `
    <ng-content *ngIf="!loading && !error"></ng-content>
    <lb-icon-load *ngIf="loading"></lb-icon-load>
    <lb-error [error]="error" [message]="errorMessage"></lb-error>`
})

export class LoadingComponent implements OnInit {
  loading: boolean = true;
  error: boolean = false;
  @Input() loadMessage: string;
  @Input() errorMessage: string = 'Something went wrong.. ';
  @Input() observable = new Observable<any>();

  ngOnInit() {
    this.observable.subscribe(
        () => {
          this.loading = false;
        },
        () => {
          this.loading = false;
          this.error = true;
        });
  }
}
