/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, Output, EventEmitter, NgFor, NgIf, Inject} from 'angular2/angular2';
import {Response} from 'angular2/http';
import {RouterLink, RouteParams} from 'angular2/router';

import {Regions} from 'app/region';
import {LolApi} from 'app/lolApi';
import {ErrorComponent} from 'app/error';

import {DDragonImageComponent} from 'app/ddragonimage'

@Component({
  selector: 'champions',
  providers: [LolApi]
})
@View({
  templateUrl: '/html/choose/champions.html',
  directives: [NgFor, NgIf, RouterLink, ErrorComponent, DDragonImageComponent]
})

export class ChampionsComponent {
  @Output() championChanged: EventEmitter = new EventEmitter();
  
  private region : Regions;
  
  private champions : Object;
  private loading: boolean = true;
  private ok: boolean = true;

  constructor(params: RouteParams, public lolApi: LolApi) {
    this.region = params.get('region');
    this.getData();
  }

  test(championKey: string)
  {
    this.championChanged.next(championKey);
  }
  
  getData()
  {
    this.champions = { data: null };
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getChampions()
      .subscribe(
        res => this.champions = res.json(),
        error => {this.ok = false; this.loading = false;},
        () => this.loading = false
      );
  }
}