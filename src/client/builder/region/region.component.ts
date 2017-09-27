import {Component} from '@angular/core';

import {RegionsSandbox} from './regions.sandbox';

@Component({
  selector: 'lb-region',
  styleUrls: ['./region.component.scss'],
  template: `
  <div class="content">
    <div class="align-center">
      <h2>Select your region</h2>
      <lb-loading [observable]="sb.regions$">
        <button *ngFor="let region of sb.regions$ | async">
          <a [routerLink]="[region?.slug]">
            <span>{{ region?.slug | uppercase }}</span>
            <span>{{ region?.name }}</span>
          </a>
        </button>
      </lb-loading>
    </div>
  </div>`
})

export class RegionComponent {
  constructor(public sb: RegionsSandbox) {}
}
