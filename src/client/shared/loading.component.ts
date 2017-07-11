import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'lb-loading',
  template: `
    <ng-content *ngIf="!loading"></ng-content>
    <lb-icon-load *ngIf="loading"></lb-icon-load>`
})

export class LoadingComponent implements OnInit {
  loading: boolean = true;
  @Input() observable = new Observable<any>();

  ngOnInit() {
    this.loading = true;
    this.observable.subscribe(
        () => {
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }
}
