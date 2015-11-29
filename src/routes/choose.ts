/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, NgIf, EventEmitter} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {FiltersComponent} from 'choose/filters';
import {ChampionsComponent} from 'choose/champions';

@Component({
  selector: 'choose'
})
@View({
  templateUrl: '/html/routes/choose.html',
  directives: [FiltersComponent, ChampionsComponent]
})

export class ChooseComponent {
  constructor() {
  }
  // 
  // private championChanged(event: EventEmitter)
  // {
  //   //this.router.navigate('/build');
  //   console.log(event);
  // }
}