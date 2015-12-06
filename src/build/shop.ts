/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, Output, Pipe, EventEmitter, NgFor, NgIf, NgClass, Inject} from 'angular2/angular2';
import {Response, ResponseOptions} from 'angular2/http';
import {RouterLink} from 'angular2/router';

import {LolApi} from 'app/lolApi';

import {ErrorComponent} from 'app/error';
import {DDragonImageComponent} from 'app/ddragonimage'


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
    "AURA": "(AOE) Area Of Effect",
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

interface Items
{
  data: Array<Object>,
}

@Component({
  selector: 'shop',
  providers: [LolApi]
})
@View({
  templateUrl: '/html/build/shop.html',
  directives: [NgFor, NgIf, NgClass, ErrorComponent, DDragonImageComponent],
  pipes: [TranslatePipe]
})

export class ShopComponent {
  @Output() itemPicked: EventEmitter = new EventEmitter();
  
  private items : Object;
  private loading: boolean = true;
  private ok: boolean = true;
  
  constructor(private lolApi: LolApi) {
    this.getData();
  }

  test(championKey: string)
  {
    this.itemPicked.next(championKey);
  }
  
  getData()
  {
    this.items = { tree: null, data: null };
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getItems()
      .subscribe(
        res => { 
          this.items = res.json(); 
          this.items['data'] = this.items['data'].filter(this.filter).sort(this.sort);
          this.items['tree'] = this.organize(this.items['tree']);
        },
        error => { this.ok = false; this.loading = false; },
        () => this.loading = false
      );
  }
  
  sort(objA, objB) {
    return objA.gold.total > objB.gold.total ? 1 : -1;
  }
  
  filter(obj) {
    // currently fixed: SummonersRiftNew && no specific champions && no hide from all
    return obj.maps[11] && !obj.requiredChampion && !obj.hideFromAll;
  }
  
  organize(tree: Object) {
    for (var category in tree) {
      tree[category].tags.splice(tree[category].tags.indexOf("_SORTINDEX"), 1);
    }
    
    return tree;
  }
}