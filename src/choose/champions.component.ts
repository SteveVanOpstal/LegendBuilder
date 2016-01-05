/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Output, EventEmitter, Inject} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {Response} from 'angular2/http';
import {RouterLink, RouteParams} from 'angular2/router';

import {LolApiService} from 'app/lolapi.service';
import {ErrorComponent} from 'app/error.component';

import {DDragonImageComponent} from 'app/ddragonimage.component'
import {BarComponent} from 'app/bar.component'

@Component({
  selector: 'champions',
  providers: [LolApiService],
  templateUrl: '/html/choose/champions.component.html',
  directives: [NgFor, NgIf, RouterLink, ErrorComponent, DDragonImageComponent, BarComponent]
})

export class ChampionsComponent {
  @Output() championChanged: EventEmitter = new EventEmitter();
  
  private region : string;
  
  private champions : Object;
  private loading: boolean = true;
  private ok: boolean = true;

  constructor(params: RouteParams, public lolApi: LolApiService) {
    this.region = params.get('region');
    this.getData();
  }

  test(championKey: string)
  {
    this.championChanged.next(championKey);
  }
  
  getData()
  {
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