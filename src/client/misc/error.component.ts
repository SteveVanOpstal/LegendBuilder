import {Component, Input} from '@angular/core';

@Component({
  selector: 'error',
  template: `
  <p *ngIf="error" class="error-item">
    <span class="error">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="icon error" viewBox="0 0 24 24" width="32" height="32">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    </span>
    <span class="error error-text">{{message}}</span>
  </p>`
})

export class ErrorComponent {
  @Input() error: boolean = false;
  @Input() message: boolean = false;
}
