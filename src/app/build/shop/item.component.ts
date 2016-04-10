import {Component, Input} from 'angular2/core';
import {NgIf} from 'angular2/common';

import {DDragonDirective} from '../../misc/ddragon.directive';

@Component({
  selector: 'item',
  directives: [NgIf, DDragonDirective],
  template: `
    <img [ddragon]="'item/' + item.image.full">
    <div>
      <p class="name">{{item.name}}</p>
      <div class="gold">
        <img [ddragon]="'ui/gold.png'">
        <p>{{item.gold.total ? item.gold.total : 'Free'}}</p>
      </div>
    </div>`
})

export class ItemComponent {
  @Input() item;
}
