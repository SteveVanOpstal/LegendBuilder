import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {LolApiService} from '../services/lolapi.service';

@Component({
  selector: 'lb-region',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./region.css').toString()],
  template: `
  <div class="align-center">
    <h2>Select your region:</h2>
    <button *ngFor="let region of regions | lbToIterable">
      <a [routerLink]="[region.slug]">
        <span>{{region.slug | uppercase}}</span>
        <span>{{region.name}}</span>
      </a>
    </button>
  </div>`
})

export class RegionComponent implements OnInit {
  private regions: Array<Object> = [];

  private loading: boolean = true;
  private error: boolean = false;

  constructor(private lolApi: LolApiService) {}

  ngOnInit() {
    this.getData();
  }

  private getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getRegions().subscribe(
        res => {
          this.regions = res;
        },
        error => {
          this.error = true;
          this.loading = false;
        },
        () => this.loading = false);
  }
}
