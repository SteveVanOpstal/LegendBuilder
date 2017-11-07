import {Component, Input} from '@angular/core';

@Component({
  selector: 'lb-error',
  styleUrls: ['error.component.scss'],
  template: `
    <ng-container *ngIf="error">
      <div>
        <lb-icon-error class="error"></lb-icon-error>
        <span class="error error-text">{{ message }}</span>
      </div>
    </ng-container>`
})

export class ErrorComponent {
  @Input() error = false;
  @Input() message = 'Something went wrong.. ';
}
