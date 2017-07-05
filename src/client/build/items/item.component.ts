import {Component, Input} from '@angular/core';

import {Item} from '../item';

@Component({
  selector: 'lb-item',
  template: `
    <img [attr.alt]="item.name"
         [attr.src]="'sprite/'+item.image.sprite | lbDDragon"
         [style.object-position]="'-' + item.image.x + 'px -' + item.image.y + 'px'">
    <p *ngIf="item.bundle > 1" class="bundle">x{{ item.bundle }}</p>
    <p class="gold" [ngClass]="{reduced : item?.discount}">
      <span class="total">
        {{ item?.gold?.total ? item?.gold?.total : '' }}
      </span>
      <span class="discount" *ngIf="item?.gold.total && item?.discount">
        {{ item?.gold?.total - item?.discount }}
      </span>
    </p>`
})

export class ItemComponent {
  @Input() item: Item;
}
