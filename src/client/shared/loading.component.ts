import {Component, Input} from '@angular/core';

@Component({
  selector: 'lb-loading',
  template: `
    <lb-icon-load *ngIf="loading"></lb-icon-load>`
})

export class LoadingComponent {
  @Input() loading: boolean;
}
