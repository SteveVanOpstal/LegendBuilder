import {Component, ViewEncapsulation} from 'angular2/core';

import {ChampionsComponent} from '../choose/champions.component';

@Component({
  selector: 'choose',
  directives: [ChampionsComponent],
  styleUrls: [
    './assets/css/choose.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <champions></champions>`
})

export class ChooseRoute { }
