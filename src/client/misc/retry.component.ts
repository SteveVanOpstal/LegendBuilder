import {NgIf} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';

import {IconRefreshComponent} from '../assets/icon-refresh.component';
import {ErrorComponent} from './error.component';

@Component({
  selector: 'retry',
  directives: [NgIf, ErrorComponent, IconRefreshComponent],
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
