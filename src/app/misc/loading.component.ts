import {Component, Input} from 'angular2/core';
import {NgIf} from 'angular2/common';

@Component({
  selector: 'loading',
  directives: [NgIf],
  template: `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" *ngIf="loading" class="icon icon-load" viewBox="0 0 32 32">
    <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>
    <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z"/>
  </svg>`
})

export class LoadingComponent {
  @Input() loading: boolean;
}
