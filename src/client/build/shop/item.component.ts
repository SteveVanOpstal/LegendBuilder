import {Component, Input} from '@angular/core';

@Component({
  selector: 'lb-item',
  styleUrls: ['./item.component.scss'],
  template: `
    <img [attr.alt]="item.name"
         [attr.src]="'sprite/' + item.image.sprite | lbDDragon"
         [style.object-position]="'-' + item.image.x + 'px -' + item.image.y + 'px'">
    <div>
      <p class="name">{{ item.name }}</p>
      <div class="gold">
        <img alt="gold" [attr.src]="'ui/gold.png' | lbDDragon">
        <p>{{ item.gold.total ? item.gold.total : 'Free' }}</p>
      </div>
    </div>`
})

export class ItemComponent {
  @Input() item;
}
