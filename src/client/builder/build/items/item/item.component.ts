import {Component, Input} from '@angular/core';

import {Item} from '../../../../data/item';

@Component({
  selector: 'g[lbItem]',
  styleUrls: ['./item.component.scss'],
  template: `
    <svg:defs>
      <clipPath id="clip">
          <rect width="48" height="48" rx="6"/>
      </clipPath>
    </svg:defs>
    <svg:image width="48" height="48" clip-path="url(#clip)"
            [attr.alt]="item.name" [attr.href]="'item/'+item.image.full | lbDDragon">
      <svg:g *ngIf="item.bundle> 1" class="bundle">x{{ item.bundle }}</g>
    </svg:image>
    <svg:g class="gold" [ngClass]="{reduced : item?.discount}">
      <g class="total">
        {{ item?.gold?.total ? item?.gold?.total : '' }}
      </g>
      <g class="discount" *ngIf="item?.gold.total && item?.discount">
        {{ item?.gold?.total - item?.discount }}
      </g>
    </svg:g>`
})

export class ItemComponent { @Input() item: Item; }
