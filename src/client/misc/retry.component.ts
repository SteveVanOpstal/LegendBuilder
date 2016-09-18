import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'retry',
  template: `
  <p *ngIf="error" class="error-item">
    <error [error]="error"></error>
    <button (click)="retryClicked()">
      <p>Retry </p>
      <icon-refresh></icon-refresh>
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
