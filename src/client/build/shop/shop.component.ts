import {NgClass, NgFor, NgIf} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';

import {CapitalizePipe} from '../../misc/capitalize.pipe';
import {DDragonDirective} from '../../misc/ddragon.directive';
import {ErrorComponent} from '../../misc/error.component';
import {LoadingComponent} from '../../misc/loading.component';
import {LolApiService} from '../../misc/lolapi.service';
import {ToIterablePipe} from '../../misc/to-iterable.pipe';
import {ItemsComponent} from '../items/items.component';

import {ItemComponent} from './item.component';
import {ChampionPipe} from './pipes/champion.pipe';
import {HidePipe} from './pipes/hide.pipe';
import {MapPipe} from './pipes/map.pipe';
import {NamePipe} from './pipes/name.pipe';
import {SortPipe} from './pipes/sort.pipe';
import {TagsPipe} from './pipes/tags.pipe';
import {TranslatePipe} from './pipes/translate.pipe';
import {PreviewComponent} from './preview/preview.component';

@Component({
  selector: 'shop',
  providers: [LolApiService, ItemsComponent],
  directives: [
    NgFor, NgIf, NgClass, PreviewComponent, ItemComponent, DDragonDirective, LoadingComponent,
    ErrorComponent
  ],
  pipes: [
    ToIterablePipe, TranslatePipe, CapitalizePipe, MapPipe, ChampionPipe, HidePipe, TagsPipe,
    NamePipe, SortPipe
  ],
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
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="icon eye" width="24" height="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 
              3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </button>
        </div>
        <div class="items">
          <template ngFor let-item [ngForOf]="items | map:11 | champion:123 | hide | tags:tags | name:name | sort">
            <item [item]="item" [ngClass]="{disabled: item.disabled}" [attr.title]="item.description" (click)="selectItem(item)" (contextmenu)="pickItem(item)"></item>
          </template>
          <loading [loading]="loading"></loading>
          <error [error]="error" (retry)="getData()"></error>
        </div>
      </div>
      <div class="right">
        <preview [item]="pickedItem" [items]="items | map:11 | champion:123" (itemPicked)="pickItem(item)"></preview>
      </div>
    </div>`
})

export class ShopComponent /*implements OnChanges*/ {
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();
  @Input() pickedItems: Array<Object>;

  private loading: boolean = true;
  private error: boolean = false;

  private tags: Array<string> = [];

  private data: Object;
  private items: Array<any> = [];
  private originalItems: Array<any> = [];
  private pickedItem: Object;

  constructor(private lolApi: LolApiService) {
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

  // ngOnChanges(changes: { [key: string]: SimpleChange; }) {
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
