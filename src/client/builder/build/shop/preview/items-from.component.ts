import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Item} from '../../../../models/item';
import {ItemBundle} from './item-bundle';

@Component({
  selector: 'lb-items-from',
  styleUrls: ['./items-from.component.scss'],
  template: `
    <div *ngFor="let bundle of items">
      <hr class="up">
      <lb-item [item]="bundle.item" [attr.title]="bundle.item.name"
               (itemSelected)="selectItem($event)"
               (itemPicked)="pickItem($event)"></lb-item>
      <hr *ngIf="bundle.children" class="down">
      <lb-items-from [items]="bundle.children"
                     (itemSelected)="selectItem($event)"
                     (itemPicked)="pickItem($event)">
      </lb-items-from>
    </div>`
})

export class ItemsFromComponent {
  @Input() items: Array<ItemBundle>;
  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemPicked: EventEmitter<Item> = new EventEmitter<Item>();

  selectItem(item: Item) {
    this.itemSelected.emit(item);
  }

  pickItem(item: Item) {
    this.itemPicked.emit(item);
    return false;  // stop context menu from appearing
  }
}
