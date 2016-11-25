import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {LolApiService} from '../../services/lolapi.service';
import {ToIterablePipe} from '../../shared/to-iterable.pipe';

@Component({
  selector: 'lb-shop',
  template: `
    <div class="left">
      <button type="button" name="all-items">All Items</button>
      <div class="category" *ngFor="let category of data?.tree | lbToIterable">
        <p class="noselect">{{category.header | lbTranslate | lbCapitalize}}</p>
        <hr>
        <label *ngFor="let tag of category.tags">
          <input *ngIf="tag != '_SORTINDEX'"
                 type="checkbox" value="{{tag}}"
                 (change)="tagChanged($event)">
          <span *ngIf="tag != '_SORTINDEX'">{{tag | lbTranslate | lbCapitalize}}</span>
        </label>
      </div>
    </div>
    <div class="right-container">
      <div class="middle">
        <div class="search">
          <input type="text" name="name" placeholder="Name" (keyup)="name=$event.target.value">
          <button type="button" name="show-disabled" title="Display hidden items">
            <lb-icon-eye></lb-icon-eye>
          </button>
        </div>
        <div class="items">
          <template ngFor let-item [ngForOf]="items
                                               | lbMap:11
                                               | lbChampion:123
                                               | lbHide
                                               | lbTags:tags
                                               | lbName:name
                                               | lbSort">
            <lb-item [item]="item"
                  [ngClass]="{disabled: item.disabled}"
                  [attr.title]="item.description"
                  (click)="selectItem(item)"
                  (contextmenu)="pickItem(item)">
            </lb-item>
          </template>
          <lb-loading [loading]="loading"></lb-loading>
          <lb-retry [error]="error" (retry)="ngOnInit()"></lb-retry>
        </div>
      </div>
      <div class="right">
        <lb-preview [item]="pickedItem"
                 [items]="items | lbMap:11 | lbChampion:123"
                 (itemPicked)="pickItem(item)">
        </lb-preview>
      </div>
    </div>`
})

export class ShopComponent implements OnInit {
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();
  @Input() pickedItems: Array<Object>;

  private loading: boolean = true;
  private error: boolean = false;

  private tags: Array<string> = [];

  private data: Object;
  private items: Array<any> = [];
  private originalItems: Array<any> = [];
  private pickedItem: Object;

  constructor(private lolApi: LolApiService) {}

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.lolApi.getItems().subscribe(
        res => {
          this.data = res;
          this.items = new ToIterablePipe().transform(res.data);
          this.originalItems = this.items;
        },
        error => {
          this.error = true;
          this.loading = false;
        },
        () => this.loading = false);
  }

  tagChanged(event: Event) {
    if (!event || !event.target) {
      return;
    }
    let input: any = event.target;
    if (input.checked) {
      this.tags.push(input.value);
    } else {
      let index: number = this.tags.indexOf(input.value);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    }
  }

  selectItem(pickedItem: Object) {
    this.pickedItem = pickedItem;
  }

  pickItem(pickedItem: Object) {
    this.itemPicked.emit(pickedItem);
    return false;  // stop context menu from appearing
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
