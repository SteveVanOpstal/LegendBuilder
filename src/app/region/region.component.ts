import {Component, ViewEncapsulation} from '@angular/core';
import {NgFor} from '@angular/common';

import {LolApiService} from '../misc/lolapi.service';
import {ToIterablePipe} from '../misc/to-iterable.pipe';

@Component({
  selector: 'region',
  providers: [LolApiService],
  directives: [NgFor],
  pipes: [ToIterablePipe],
  styles: [
    require('../../assets/css/region.css')
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="align-center">
    <h2>Select your region:</h2>
    <button *ngFor="let region of regions | toIterable">
      <a [routerLink]="[region.slug]">
        <span>{{region.slug | uppercase}}</span>
        <span>{{region.name}}</span>
      </a>
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
