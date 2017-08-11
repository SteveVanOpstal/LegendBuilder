import {Component, ViewEncapsulation} from '@angular/core';

import {LolApiService} from '../services';

@Component({
  selector: 'lb-region',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./region.css').toString()],
  template: `
  <div class="align-center">
    <h2>Select your region:</h2>
    <lb-loading [observable]="lolApi.getRegions()">
      <button *ngFor="let region of lolApi.getRegions() | async">
        <a [routerLink]="[region?.slug]">
          <span>{{ region?.slug | uppercase }}</span>
          <span>{{ region?.name }}</span>
        </a>
      </button>
    </lb-loading>
  </div>`
})

export class RegionComponent {
  constructor(public lolApi: LolApiService) {}
}
