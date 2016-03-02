/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, EventEmitter} from 'angular2/core';
import {Router} from 'angular2/router';


import {FiltersComponent} from 'app/filters.component';
import {ChampionsComponent} from 'app/champions.component';

@Component({
  selector: 'choose',
  directives: [FiltersComponent, ChampionsComponent],
  template: `
    <filters></filters>
    <champions (champion-changed)="championChanged($event)"></champions>`
})

export class ChooseRoute {}