import {Component, Input} from '@angular/core';

@Component({
  selector: 'lb-item',
  template: `
    <img [attr.alt]="item.name" [attr.src]="'item/' + item.image.full | lbDDragon">
    <div>
      <p class="name">{{item.name}}</p>
      <div class="gold">
        <img alt="gold" [attr.src]="'ui/gold.png' | lbDDragon">
        <p>{{item.gold.total ? item.gold.total : 'Free'}}</p>
      </div>
    </div>`
})

export class ItemComponent {
  @Input() item;
}
