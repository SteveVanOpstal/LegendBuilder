/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, EventEmitter} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {Router} from 'angular2/router';


import {FiltersComponent} from 'app/filters.component';
import {ChampionsComponent} from 'app/champions.component';

@Component({
  selector: 'choose'
})
@View({
  template: `
    <filters></filters>
    <champions (champion-changed)="championChanged($event)"></champions>`,
  directives: [FiltersComponent, ChampionsComponent]
})

export class ChooseRoute {}