import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {LolApiService} from '../services';

@Component({
  selector: 'lb-region',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./region.css').toString()],
  template: `
  <div class="align-center">
    <h2>Select your region:</h2>
    <button *ngFor="let region of regions | toArray">
      <a [routerLink]="[region.slug]">
        <span>{{ region.slug | uppercase }}</span>
        <span>{{ region.name }}</span>
      </a>
    </button>
  </div>`
})

export class RegionComponent implements OnInit {
  regions: Array<Object> = [];

  private loading: boolean = true;
  private error: boolean = false;

  constructor(private lolApi: LolApiService) {}

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.lolApi.getRegions().subscribe(
        res => {
          this.regions = res;
        },
        () => {
          this.error = true;
          this.loading = false;
        },
        () => this.loading = false);
  }
}
