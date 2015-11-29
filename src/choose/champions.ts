/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, Output, EventEmitter, NgFor, NgIf} from 'angular2/angular2';
import {Response, ResponseOptions} from 'angular2/http';
import {RouterLink} from 'angular2/router';

import {LolApi} from 'lolApi';

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
  templateUrl: 'html/champions.html',
  directives: [NgFor, NgIf, RouterLink]
})

export class ChampionsComponent {
  @Output() championChanged: EventEmitter = new EventEmitter();

  //private champions: Response = new Response(new ResponseOptions());
  
  private champions : Champions;

  constructor(lolApi: LolApi) {
    this.champions = {data: [], loading: true, ok: true};
    lolApi.getChampions()
      .subscribe(
        res => this.champions.data = res.json(),
        error => {this.champions.ok = false; this.champions.loading = false;},
        () => this.champions.loading = false
      );
    // lolApi.getChampions()
    //   .subscribe(res => this.champions = res);
  }

  test(championKey: string)
  {
    this.championChanged.next(championKey);
  }
}