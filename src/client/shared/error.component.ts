import {Component, Input} from '@angular/core';

@Component({
  selector: 'lb-error',
  template: `
  <p *ngIf="error" class="error-item">
    <lb-icon-error class="error"></lb-icon-error>
    <span class="error error-text">{{ message }}</span>
  </p>`
})

export class ErrorComponent {
  @Input() error: boolean = false;
  @Input() message: string = 'Something went wrong.. ';
}
