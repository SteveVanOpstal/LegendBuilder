///<reference path="typings/angular2/angular2.d.ts"/>
///<reference path="typings/angular2/http.d.ts"/>

import {Injectable, bind} from 'angular2/core';
import {Http, Headers, Response, BaseResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';

import 'rxjs/rx';

import {config} from 'app/lolServerConfig';

@Injectable()
export class LolApiService {
  realm: any;
  
  constructor(private params: RouteParams, private http: Http) {
    this.http.get(this.linkStaticData() + '/realm')
      .map(res => res = this.handleResponse(res))
      .subscribe(res => this.realm = res.json());
  }

  public getRealm() {
    return this.realm;
  }

  public getChampions() {
    return this.http.get(this.linkStaticData() + '/champion?champData=info')
      .map(res => res = this.handleResponse(res));
  }

  public getChampion(championKey) {
    return this.http.get(this.linkStaticData() + '/champion/' + championKey + '?champData=allytips,altimages,image,partype,passive,spells,stats,tags')
      .map(res => res = this.handleResponse(res));
  }

  public getItems() {
    return this.http.get(this.linkStaticData() + '/item?itemListData=all')
      .map(res => res = this.handleResponse(res));
  }
  
  private handleResponse(res: Response): Response {
    var resData = res.json();
    if (resData['data']) {
      resData['data'] = this.objectToArray(res.json()['data'])
    }
    
    var options = new BaseResponseOptions();
    return new Response(options.merge({ body: resData }));;
  }

  private objectToArray(obj: Object): Array<Object> {
    var arr = Array<Object>();
    for (var property in obj) {
      arr.push(obj[property]);
    }
    return arr;
  }
  
  private linkStaticData()
  {
    return this.baseUrl() + "static-data/" + this.getRegion() + '/v1.2';
  }
  
  private linkSummoner()
  {
    return this.baseUrl() + this.getRegion() + '/v1.4/summoner';
  }
  
  private linkGame()
  {
    return this.baseUrl() + this.getRegion() + '/v1.3/game';
  }
  
  private baseUrl()
  {
    return "http://" + config.host + ":" + config.port + "/";
  }
  
  private getRegion()
  {
    return this.params.get('region').toLowerCase();
  }
}