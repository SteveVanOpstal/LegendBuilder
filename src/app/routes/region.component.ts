import {Component, ViewEncapsulation} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {RouterLink} from 'angular2/router';

@Component({
  selector: 'region',
  directives: [NgFor, RouterLink],
  styleUrls: [
    './assets/css/region.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="align-center">
    <h2>Select your region:</h2>
    <button *ngFor="#region of regions" [routerLink]="['../Choose', {region: region.id}]">
      <span>{{region.id | uppercase}}</span>
      <span>{{region.name}}</span>
    </button>
  </div>`
})

export class RegionRoute {
  private regions = [
    {
      id: 'br',
      name: 'Brazil'
    },
    {
      id: 'eune',
      name: 'EU Nordic & East'
    },
    {
      id: 'euw',
      name: 'EU West'
    },
    {
      id: 'kr',
      name: 'Korea'
    },
    {
      id: 'lan',
      name: 'Latin America North'
    },
    {
      id: 'las',
      name: 'Latin America South'
    },
    {
      id: 'na',
      name: 'North America'
    },
    {
      id: 'oce',
      name: 'Oceania'
    },
    // {
    //   id: 'pbe',
    //   name: 'Public Beta Environment'
    // },
    {
      id: 'ru',
      name: 'Russia'
    },
    {
      id: 'tr',
      name: 'Turkey'
    }];
}
