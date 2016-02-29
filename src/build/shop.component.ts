/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Output, Pipe, EventEmitter, Inject} from 'angular2/core';
import {NgFor, NgIf, NgClass} from 'angular2/common';

import {LolApiService} from 'app/lolapi.service';

import {ErrorComponent} from 'app/error.component';
import {DDragonDirective} from 'app/ddragon.directive';


@Pipe({
  name: 'translate'
})
  
class TranslatePipe {
  translator: Object = 
  {
    "GOLDPER":"Gold income",
    "TRINKET": "Trinkets",
    "SPELLBLOCK": "Magic resist",
    "HEALTHREGEN": "Health regen",
    "CRITICALSTRIKE": "Critical strike",
    "SPELLDAMAGE": "Ability power",
    "COOLDOWNREDUCTION": "Cooldown reduction",
    "MANAREGEN": "Mana regen",
    "NONBOOTSMOVEMENT": "Other",
    "ARMORPENETRATION": "Armor penetration",
    "AURA": "Area Of Effect",
    "MAGICPENETRATION": "Magic penetration",
    "ONHIT": "On hit effect",
    "SPELLVAMP": "Spell vamp",
    "UNCATEGORIZED": "Other"
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
          <span class="icon-eye" aria-hidden="true"></span>
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
        <error [loading]="loading" [ok]="ok" (retry)="getData()"></error>
      </div>
    </div>`,
  directives: [NgFor, NgIf, NgClass, ErrorComponent, DDragonDirective],
  pipes: [TranslatePipe]
})

export class ShopComponent {
  @Output() itemPicked: EventEmitter = new EventEmitter();
  
  private items: Object;
  private loading: boolean = true;
  private ok: boolean = true;
  
  constructor(private lolApi: LolApiService) {
    this.getData();
  }
  
  getData() {
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getItems()
      .subscribe(
        res => { 
          this.items = this.alterData(res.json());
        },
        error => { this.ok = false; this.loading = false; },
        () => this.loading = false
      );
  }
  
  alterData(newItems: Object): Object
  {
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
      tree[category].tags.splice(tree[category].tags.indexOf("_SORTINDEX"), 1);
    }
    
    return tree;
  }
}