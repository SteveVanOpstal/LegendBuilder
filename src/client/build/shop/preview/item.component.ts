import {Component, Input, Output, EventEmitter} from '@angular/core';

import {DDragonDirective} from '../../../misc/ddragon.directive';
import {Item} from '../../item';

@Component({
  selector: 'item',
  directives: [DDragonDirective],
  template: `
    <img [ddragon]="'item/' + item?.image?.full" (click)="selectItem(item)" (contextmenu)="pickItem(item)">
    <p class="gold" (click)="selectItem(item)" (contextmenu)="pickItem(item)">{{item?.gold?.total ? item?.gold?.total : ''}}</p>`
})

export class ItemComponent {
  @Input() item: Item;
  @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();

  private selectItem(item: Item) {
    this.itemSelected.emit(item);
  }

  private pickItem(item: Item) {
    this.itemPicked.emit(item);
    return false; // stop context menu from appearing
  }
}
