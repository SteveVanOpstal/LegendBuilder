import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {LolApiService} from '../../services/lolapi.service';
import {ToIterablePipe} from '../../misc/to-iterable.pipe';

@Component({
  selector: 'shop',
  template: `
    <div class="left">
      <button type="button" name="all-items">All Items</button>
      <div class="category" *ngFor="let category of data?.tree | toIterable">
        <p class="noselect">{{category.header | translate | capitalize}}</p>
        <hr>
        <label *ngFor="let tag of category.tags">
          <input *ngIf="tag != '_SORTINDEX'" type="checkbox" value="{{tag}}" (change)="tagChanged($event)">
          <span *ngIf="tag != '_SORTINDEX'">{{tag | translate | capitalize}}</span>
        </label>
      </div>
    </div>
    <div class="right-container">
      <div class="middle">
        <div class="search">
          <input type="text" name="name" placeholder="Name" (keyup)="name=$event.target.value">
          <button type="button" name="show-disabled" title="Display hidden items">
            <icon-eye></icon-eye>
          </button>
        </div>
        <div class="items">
          <template ngFor let-item [ngForOf]="items | map:11 | champion:123 | hide | tags:tags | name:name | sort">
            <item [item]="item" [ngClass]="{disabled: item.disabled}" [attr.title]="item.description" (click)="selectItem(item)" (contextmenu)="pickItem(item)"></item>
          </template>
          <loading [loading]="loading"></loading>
          <retry [error]="error" (retry)="getData()"></retry>
        </div>
      </div>
      <div class="right">
        <preview [item]="pickedItem" [items]="items | map:11 | champion:123" (itemPicked)="pickItem(item)"></preview>
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
    this.getData();
  }

  getData() {
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

  private tagChanged(event: Event) {
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

  private selectItem(pickedItem: Object) {
    this.pickedItem = pickedItem;
  }

  private pickItem(pickedItem: Object) {
    this.itemPicked.emit(pickedItem);
    return false;  // stop context menu from appearing
  }
}
