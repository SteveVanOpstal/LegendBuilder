import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

import {DDragonDirective} from '../../misc/ddragon.directive';

@Component({
  selector: 'item',
  directives: [NgIf, DDragonDirective],
  template: `
    <template ngFor let-item [ngForOf]="items" #i="index">
      <item [item]="item" [ngClass]="{disabled: item.disabled}" [attr.title]="item.description" style="left: {{xScaleTime(item.time)}}px" (contextmenu)="rightClicked(item)"></item>
    </template>`
})

export class ItemComponent {
  @Input() items;
}
