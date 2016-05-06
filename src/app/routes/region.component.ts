import {Component, ViewEncapsulation} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {RouterLink} from 'angular2/router';

import {LolApiService} from '../misc/lolapi.service';
import {ToIterablePipe} from '../misc/to-iterable.pipe';

@Component({
  selector: 'region',
  providers: [LolApiService],
  directives: [NgFor, RouterLink],
  pipes: [ToIterablePipe],
  styleUrls: [
    './assets/css/region.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="align-center">
    <h2>Select your region:</h2>
    <button *ngFor="#region of regions | toIterable" [routerLink]="['../Champions', {region: region.id}]">
      <span>{{region.slug | uppercase}}</span>
      <span>{{region.name}}</span>
    </button>
  </div>`
})

export class RegionsComponent {
  private regions: Array<Object> = [];

  private loading: boolean = true;
  private error: boolean = false;

  constructor(public lolApi: LolApiService) {
    this.getData();
  }

  private getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getRegions()
      .subscribe(
      res => {
        this.regions = res;
        this.regions.push({ name: 'Public Beta Environment', slug: 'pbe' });
      },
      error => { this.error = true; this.loading = false; },
      () => this.loading = false
      );
  }
}
