import {Component, ViewChild} from '@angular/core';

import {Item} from '../../../data/item';
import {BuildSandbox} from '../build.sandbox';

import {PreviewComponent} from './preview/preview.component';

@Component({
  selector: 'lb-shop',
  styleUrls: ['./shop.component.scss'],
  template: `
    <div class="left">
      <button type="button" name="all-items">All Items</button>
      <div class="category" *ngFor="let category of sb.itemsTree$ | async">
        <p class="noselect">{{ category.header | lbTranslate | lbCapitalize }}</p>
        <hr>
        <label *ngFor="let tag of category.tags">
          <input *ngIf="tag != '_SORTINDEX'"
                type="checkbox" value="{{tag}}"
                (change)="tagChanged($event)">
          <span *ngIf="tag != '_SORTINDEX'">{{ tag | lbTranslate | lbCapitalize }}</span>
        </label>
      </div>
    </div>
    <div class="right-container">
      <div class="middle">
        <div class="search">
          <input type="text"
                 name="item name"
                 placeholder="Item name"
                 aria-label="search for item"
                 (keyup)="name=$event.target.value">
          <button type="button" name="show-disabled" title="Display hidden items">
            <lb-icon-eye></lb-icon-eye>
          </button>
        </div>
        <div class="items">
          <ng-template ngFor let-item [ngForOf]="sb.items$
                                              | async
                                              | lbMap:11
                                              | lbChampion:sb.championId$
                                              | lbHide
                                              | lbTags:tags
                                              | lbName:name
                                              | lbSort">
            <lb-item [item]="item"
                  [ngClass]="{disabled: item.disabled}"
                  [attr.title]="item.description"
                  (click)="preview.selectItem(item)"
                  (contextmenu)="pickItem(item);preview.selectItem(item)"
                  (dblclick)="pickItem(item);preview.selectItem(item)">
            </lb-item>
          </ng-template>
          <lb-loading [observable]="sb.items$"></lb-loading>
        </div>
      </div>
      <div class="right">
        <lb-preview #preview
                    [items]="sb.items$ | async | lbMap:11 | lbChampion:sb.championId$"
                    (itemPicked)="pickItem($event)">
        </lb-preview>
      </div>
    </div>`
})

export class ShopComponent {
  @ViewChild(PreviewComponent) preview: PreviewComponent;

  tags: Array<string> = [];
  name: string;

  constructor(public sb: BuildSandbox) {}

  tagChanged(event: Event) {
    if (!event || !event.target) {
      return;
    }
    const input: any = event.target;
    if (input.checked) {
      this.tags.push(input.value);
    } else {
      const index: number = this.tags.indexOf(input.value);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    }
  }

  pickItem(item: Item) {
    this.sb.addItem(item);
    return false;  // stop context menu from appearing
  }

  selectItem(item: Item) {
    this.preview.selectItem(item);
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (!changes['pickedItems'] || !changes['pickedItems'].currentValue) {
  //     return;
  //   }

  //   let exceededGroups =
  //   this.getExceededGroups(changes['pickedItems'].currentValue);
  //   this.items = this.originalItems.filter((item) => {
  //     if (exceededGroups.indexOf(item['group']) !== -1) {
  //       return false;
  //     }
  //     return true;
  //   });
  // }

  // private getExceededGroups(items: Array<Object>): Array<Object> {
  //   let groupsCount = [];
  //   items.forEach((item) => {
  //     if (!item['group']) {
  //       return;
  //     }
  //     if (groupsCount.indexOf(item['group']) === -1) {
  //       groupsCount[item['group']] = 1;
  //     } else {
  //       groupsCount[item['group']]++;
  //     }
  //   });
  //   let exceededGroups = [];
  //   this.data['groups'].forEach((group) => {
  //     if (groupsCount[group['key']] > 0 && groupsCount[group['key']] >=
  //     group['MaxGroupOwnable']) {
  //       exceededGroups.push(group['key']);
  //     }
  //   });
  //   return exceededGroups;
  // }
}
