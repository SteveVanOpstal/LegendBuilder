import {Component, Input, Output, EventEmitter, OnChanges} from 'angular2/core';
import {NgFor, NgClass} from 'angular2/common';
import {Observable} from 'rxjs/Observable';

import {ItemComponent} from './item.component.ts';
import {Config} from '../config';

@Component({
  selector: 'items',
  directives: [NgFor, NgClass, ItemComponent],
  template: `
    <template ngFor #item [ngForOf]="items" #i="index">
      <item [item]="item" [ngClass]="{disabled: item.disabled}" [attr.title]="item.description" style="left: {{i * 50}}px"></item>
    </template>`
})

export class ItemsComponent implements OnChanges {
  @Input() items: Array<Object>;
  @Input() config: Config;

  ngOnChanges() {
    // TODO: implement
  }
}
