import {NgIf} from '@angular/common';
import {Component, Input} from '@angular/core';

import {IconLoadComponent} from '../assets/icon-load.component';

@Component({
  selector: 'loading',
  directives: [NgIf, IconLoadComponent],
  template: `
    <icon-load *ngIf="loading"></icon-load>`
})

export class LoadingComponent {
  @Input() loading: boolean;
}
