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
  private champion: Object;
  private loading: boolean = true;
  private ok: boolean = true;
  
  constructor(params: RouteParams, private lolApi: LolApi) {
    this.getData(params.get('champion'));
  }
  
  getData(championName: string) {
    this.champion = { image: {full: null}, spells: null, name:null };
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getChampion(championName)
      .subscribe(
        res => this.champion = res.json(),
        error => {this.ok = false; this.loading = false;},
        () => this.loading = false
      );
  }
}