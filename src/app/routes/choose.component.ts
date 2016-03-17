import {Component} from 'angular2/core';

import {FiltersComponent} from '../choose/filters.component';
import {ChampionsComponent} from '../choose/champions.component';

@Component({
  selector: 'choose',
  directives: [FiltersComponent, ChampionsComponent],
  template: `
    <filters></filters>
    <champions></champions>`
})

export class ChooseRoute { }
