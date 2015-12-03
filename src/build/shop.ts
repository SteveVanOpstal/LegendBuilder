/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, Output, EventEmitter, NgFor, NgIf, NgClass, Inject} from 'angular2/angular2';
import {Response, ResponseOptions} from 'angular2/http';
import {RouterLink} from 'angular2/router';

import {LolApi} from 'app/lolApi';

import {ErrorComponent} from 'app/error';
import {DDragonImageComponent} from 'app/ddragonimage'

interface Items
{
  data: Array<Object>,
  loading: boolean,
  ok: boolean
}

@Component({
  selector: 'shop',
  providers: [LolApi]
})
@View({
  templateUrl: '/html/build/shop.html',
  directives: [NgFor, NgIf, NgClass, ErrorComponent, DDragonImageComponent]
})

export class ShopComponent {
  @Output() itemPicked: EventEmitter = new EventEmitter();
  
  private items : Items;
  
  constructor(private lolApi: LolApi) {
    this.getData();
  }
  
  filter(obj) {
    // currently fixed: SummonersRiftNew && no specific champions && no hide from all
    return obj.maps[11] && !obj.requiredChampion && !obj.hideFromAll;
  }
  
  sort(objA, objB) {
    return objA.gold.total > objB.gold.total ? 1 : -1;
  }

  test(championKey: string)
  {
    this.itemPicked.next(championKey);
  }
  
  getData()
  {
    this.items = {data: [], loading: true, ok: true};
    this.lolApi.getItems()
      .subscribe(
        res => this.items.data = res.json().filter(this.filter).sort(this.sort),
        error => {this.items.ok = false; this.items.loading = false;},
        () => this.items.loading = false
      );
  }
}