import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {ItemComponent} from './item.component';
import {ItemBundle} from './item-bundle';

@Component({
  selector: 'items-from',
  directives: [ItemComponent, ItemsFromComponent],
  template: `
    <template ngFor #bundle [ngForOf]="items">
      <div>
        <item [item]="bundle.item" [attr.title]="bundle.item.name" (click)="leftClick(bundle.item)"></item>
        <items-from [items]="bundle.children" (itemPicked)="leftClick($event)"></items-from>
      </div>
    </template>`
})

export class ItemsFromComponent {
  @Input() items: Array<ItemBundle>;
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();

  leftClick(item: Object) {
    this.itemPicked.next(item);
  }
}
