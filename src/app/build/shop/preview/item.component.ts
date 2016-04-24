import {Component, Input, Inject, forwardRef} from 'angular2/core';

import {DDragonDirective} from '../../../misc/ddragon.directive';

@Component({
  selector: 'item',
  directives: [DDragonDirective],
  template: `
    <img [ddragon]="'item/' + item?.image?.full">
    <p class="gold">{{item?.gold?.total ? item?.gold?.total : ''}}</p>`
})

export class ItemComponent {
  @Input() item: Object;
}
