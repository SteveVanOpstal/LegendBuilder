import {Component, ViewEncapsulation} from 'angular2/core';

import {FiltersComponent} from '../choose/filters.component';
import {ChampionsComponent} from '../choose/champions.component';

@Component({
  selector: 'choose',
  directives: [FiltersComponent, ChampionsComponent],
  styleUrls: [
    './assets/css/choose.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <filters></filters>
    <champions></champions>`
})

export class ChooseRoute { }
