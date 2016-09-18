import {Component, Input} from '@angular/core';

@Component({
  selector: 'loading',
  template: `
    <icon-load *ngIf="loading"></icon-load>`
})

export class LoadingComponent {
  @Input() loading: boolean;
}
