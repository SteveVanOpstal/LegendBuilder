import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'lb-retry',
  template: `
  <p *ngIf="error" class="error-item">
    <lb-error [error]="error"></lb-error>
    <button (click)="retryClicked()">
      <p>Retry </p>
      <lb-icon-refresh></lb-icon-refresh>
    </button>
  </p>`
})

export class RetryComponent {
  @Input() error: boolean = false;
  @Output() retry: EventEmitter<any> = new EventEmitter<any>();

  retryClicked() {
    this.retry.emit(undefined);
  }
}
