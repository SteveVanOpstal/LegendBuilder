import {Component, EventEmitter, Input, Output} from '@angular/core';

import {ItemBundle} from './item-bundle';

@Component({
  selector: 'lb-items-from',
  template: `
    <div *ngFor="let bundle of items">
      <hr class="up">
      <lb-item [item]="bundle.item" [attr.title]="bundle.item.name"></lb-item>
      <hr *ngIf="bundle.children" class="down">
      <lb-items-from [items]="bundle.children"
                  (itemSelected)="itemSelected.emit($event)"
                  (itemPicked)="itemPicked.emit($event)">
      </lb-items-from>
    </div>`
})

export class ItemsFromComponent {
  @Input() items: Array<ItemBundle>;
  @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();
}
