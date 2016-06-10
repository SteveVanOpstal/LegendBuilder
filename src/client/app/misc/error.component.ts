import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'error',
  directives: [NgIf],
  template: `
  <p *ngIf="error" class="error-item">
    <span class="error">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="icon error" viewBox="0 0 24 24" width="32" height="32">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    </span>
    <span class="error error-text">Something went wrong.. </span>
    <button (click)="retryClicked()">
      <p>Retry </p>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="icon refresh" viewBox="0 0 24 24" width="32" height="32">>
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0
        3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </button>
  </p>`
})

export class ErrorComponent {
  @Input() error: boolean = false;
  @Output() retry: EventEmitter<any> = new EventEmitter<any>();

  retryClicked() {
    this.retry.emit(undefined);
  }
}
