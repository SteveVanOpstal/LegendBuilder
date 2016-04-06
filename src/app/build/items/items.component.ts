import {Component, Input, OnChanges} from 'angular2/core';
import {NgFor, NgClass} from 'angular2/common';

import {ItemComponent} from './item.component.ts';

import {ToIterablePipe} from '../../misc/to-iterable.pipe';

@Component({
  selector: 'items',
  directives: [NgFor, NgClass, ItemComponent],
  pipes: [ToIterablePipe],
  template: `
    <template ngFor #item [ngForOf]="items?.data | toIterable">
      <item [item]="item" [ngClass]="{disabled: item.disabled}" [attr.title]="item.description"></item>
    </template>`
})

export class ItemsComponent implements OnChanges {
  @Input() items;

  ngOnChanges() {
    // TODO: implement
  }
}
