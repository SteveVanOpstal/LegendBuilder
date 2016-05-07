import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';

import {ItemComponent} from './item.component';
import {ItemBundle} from './item-bundle';

@Component({
  selector: 'items-from',
  directives: [NgFor, NgIf, ItemComponent, ItemsFromComponent],
  template: `
    <div *ngFor="let bundle of items">
      <hr class="up">
      <item [item]="bundle.item" [attr.title]="bundle.item.name" (click)="selectItem(bundle.item)" (contextmenu)="pickItem(bundle.item)"></item>
      <hr *ngIf="bundle.children" class="down">
      <items-from [items]="bundle.children" (itemSelected)="itemSelected" (itemPicked)="itemPicked"></items-from>
    </div>`
})

export class ItemsFromComponent {
  @Input() items: Array<ItemBundle>;
  @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();

  private selectItem(item: Object) {
    this.itemSelected.emit(item);
  }

  private pickItem(item: Object) {
    this.itemPicked.emit(item);
    return false; // stop context menu from appearing
  }
}
