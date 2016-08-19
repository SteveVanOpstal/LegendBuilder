import {Component, Input} from '@angular/core';

import {IconErrorComponent} from '../assets/icon-error.component';

@Component({
  selector: 'error',
  directives: [IconErrorComponent],
  template: `
  <p *ngIf="error" class="error-item">
    <icon-error class="error"></icon-error>
    <span class="error error-text">{{message}}</span>
  </p>`
})

export class ErrorComponent {
  @Input() error: boolean = false;
  @Input() message: string = 'Something went wrong.. ';
}
