import {Pipe, PipeTransform, Component, Output, EventEmitter, Inject} from 'angular2/core';
import {NgFor, NgClass} from 'angular2/common';

import {DDragonDirective} from '../misc/ddragon.directive';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';

import {LolApiService} from '../misc/lolapi.service';

@Pipe({
  name: 'translate'
})

class TranslatePipe implements PipeTransform {
  translator: Object =
  {
    'GOLDPER': 'Gold income',
    'TRINKET': 'Trinkets',
    'SPELLBLOCK': 'Magic resist',
    'HEALTHREGEN': 'Health regen',
    'CRITICALSTRIKE': 'Critical strike',
    'SPELLDAMAGE': 'Ability power',
    'COOLDOWNREDUCTION': 'Cooldown reduction',
    'MANAREGEN': 'Mana regen',
    'NONBOOTSMOVEMENT': 'Other',
    'ARMORPENETRATION': 'Armor penetration',
    'AURA': 'Area Of Effect',
    'MAGICPENETRATION': 'Magic penetration',
    'ONHIT': 'On hit effect',
    'SPELLVAMP': 'Spell vamp',
    'UNCATEGORIZED': 'Other'
  };

  transform(value: string, args: any[]) {
    if (!value) {
      return false;
    } else if (this.translator[value]) {
      return this.translator[value];
    }
    return this.capitalize(value.toLowerCase());
  }

  private capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}

@Component({
  selector: 'shop',
  providers: [LolApiService],
  directives: [NgFor, NgClass, DDragonDirective, LoadingComponent, ErrorComponent],
  pipes: [TranslatePipe],
  template: `
    <div class="left">
      <button type="button" name="all-items">All Items</button>
      <div class="category" *ngFor="#category of items?.tree">
        <p class="noselect">{{category.header | translate}}</p>
        <hr>
        <label *ngFor="#tag of category.tags">
          <input type="checkbox" name="{{tag}}">
          <span>{{tag | translate}}</span>
        </label>
      </div>
    </div> 
    <div class="right">
      <div class="search">
        <input type="text" name="name" placeholder="Name">
        <button type="button" name="show-disabled" title="Display hidden items">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="icon eye" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 
            3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </button>
      </div>
      <div class="items">
        <div class="item" *ngFor="#item of items?.data" [ngClass]="{disabled: item.disabled}" title="{{item.description}}">
          <img [ddragon]="'item/' + item.image.full">
          <div>
            <p class="name">{{item.name}}</p>
            <div class="gold">
              <img [ddragon]="'ui/gold.png'">
              <p>{{item.gold.total}}</p>
            </div>
          </div>
        </div>
        <loading [loading]="loading"></loading>
        <error [error]="error" (retry)="getData()"></error>
      </div>
    </div>`
})

export class ShopComponent {
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();

  private items: Object;
  private loading: boolean = true;
  private error: boolean = false;

  constructor(private lolApi: LolApiService) {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getItems()
      .subscribe(
      res => {
        this.items = this.alterData(res.json());
      },
      error => { this.error = true; this.loading = false; },
      () => this.loading = false
      );
  }

  alterData(newItems: Object): Object {
    var alteredItems = { data: null, tree: null };
    alteredItems.data = newItems['data'].filter(this.filter).sort(this.sort);
    alteredItems.tree = this.removeSortIndex(newItems['tree']);
    return alteredItems;

  }

  sort(objA, objB) {
    return objA.gold.total > objB.gold.total ? 1 : -1;
  }

  filter(obj) {
    //TODO: currently fixed: SummonersRiftNew && no specific champions && no hide from all
    return obj.maps[11] && !obj.requiredChampion && !obj.hideFromAll;
  }

  removeSortIndex(tree: Object) {
    for (var category in tree) {
      tree[category].tags.splice(tree[category].tags.indexOf('_SORTINDEX'), 1);
    }

    return tree;
  }
}
