/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, Output, EventEmitter, NgFor, NgIf, Inject} from 'angular2/angular2';
import {Response, ResponseOptions} from 'angular2/http';
import {RouterLink, RouteParams} from 'angular2/router';

import {Regions} from 'app/region';
import {LolApi} from 'app/lolApi';
import {ErrorComponent} from 'app/error';

import {DDragonImageComponent} from 'app/ddragonimage'

interface Champions
{
  data: Array<Object>,
  loading: boolean,
  ok: boolean
}

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

  //private champions: Response = new Response(new ResponseOptions());
  
  private champions : Champions;
  private region : Regions;

  constructor(params: RouteParams, public lolApi: LolApi) {
    this.region = params.get('region');
    this.champions = {data: [], loading: true, ok: true};
    this.getData();
    // lolApi.getChampions()
    //   .subscribe(res => this.champions = res);
  }

  test(championKey: string)
  {
    this.championChanged.next(championKey);
  }
  
  getData()
  {
    this.champions = {data: [], loading: true, ok: true};
    this.lolApi.getChampions()
      .subscribe(
        res => this.champions.data = res.json(),
        error => {this.champions.ok = false; this.champions.loading = false;},
        () => this.champions.loading = false
      );
  }
}