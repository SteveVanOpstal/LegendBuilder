/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, NgFor, NgClass, Input, DynamicComponentLoader, ElementRef} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';

import {ErrorComponent} from 'app/error';
import {DDragonImageComponent} from 'app/ddragonImage';

import {LolApi} from 'app/lolApi';

interface Champion
{
  data: Array<Object>,
  loading: boolean,
  ok: boolean
}

@Component({
  selector: 'abilities',
  providers: [LolApi]
})
@View({
  templateUrl: '/html/build/abilities.html',
  directives: [NgFor, NgClass, ErrorComponent, DDragonImageComponent]
})

export class AbilitiesComponent {
  private champion: Champion;
  
  constructor(params: RouteParams, private lolApi: LolApi) {
    this.champion = {data: [], loading: true, ok: true};
    this.getData(params.get('champion'));
  }
  
  getData(championName: string) {
    this.champion = {data: [], loading: true, ok: true};
    this.lolApi.getChampion(championName)
      .subscribe(
        res => this.champion.data = res.json(),
        error => {this.champion.ok = false; this.champion.loading = false;},
        () => this.champion.loading = false
      );
  }
}