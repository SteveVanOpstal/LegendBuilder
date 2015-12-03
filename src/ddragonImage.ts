/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, Input, NgIf, ChangeDetectionStrategy} from 'angular2/angular2';

@Component({
  selector: 'ddragonimage',
  changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
    template: '<img src="http://ddragon.leagueoflegends.com/cdn/{{version}}/img/{{image}}">',
    directives: [NgIf]
})

export class DDragonImageComponent {
  @Input() image: string;
  
  private version: string = '5.23.1';
  
  constructor() {
  }
}