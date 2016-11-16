import {Component, Input} from '@angular/core';

@Component({
  selector: 'lb-item',
  template: `
    <img [lbDDragon]="'item/' + item.image.full">
    <div>
      <p class="name">{{item.name}}</p>
      <div class="gold">
        <img [lbDDragon]="'ui/gold.png'">
        <p>{{item.gold.total ? item.gold.total : 'Free'}}</p>
      </div>
    </div>`
})

export class ItemComponent {
  @Input() item;
}
