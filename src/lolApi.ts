///<reference path="typings/angular2/angular2.d.ts"/>
///<reference path="typings/angular2/http.d.ts"/>

import {Injectable, bind} from 'angular2/angular2';
import {Http, Headers, Response, BaseResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';

import {Regions} from 'app/region';

@Injectable()  
export class LolApi {
  realm: any;
  
  constructor(private params: RouteParams, private http: Http) {
    this.http.get(this.LinkStaticData() + '/realm')
      .map(res => res = this.HandleResponse(res))
      .subscribe(res => this.realm = res.json());
  }

  public getRealm() {
    return this.realm;
  }

  public getChampions() {
    return this.http.get(this.LinkStaticData() + '/champion?champData=info')
      .map(res => res = this.HandleResponse(res));
  }

  public getChampion(championKey) {
    return this.http.get(this.LinkStaticData() + '/champion/' + championKey + '?champData=allytips,altimages,image,partype,passive,spells,stats,tags')
      .map(res => res = this.HandleResponse(res));
  }

  public getItems() {
    return this.http.get(this.LinkStaticData() + '/item?itemListData=all')
      .map(res => res = this.HandleResponse(res));
  }
  
  private HandleResponse(res: Response): Response {
    var options = new BaseResponseOptions();
    var resData = res.json();
    if (resData['data']) {
      resData['data'] = this.ObjectToArray(res.json()['data'])
      return new Response(options.merge({body: resData}));
    }
    else {
      return new Response(options.merge({body: res.json()}));
    }
  }

  private ObjectToArray(obj: Object): Array<Object> {
    var arr = Array<Object>();
    for (var property in obj) {
      arr.push(obj[property]);
    }
    return arr;
  }
  
  private LinkStaticData()
  {
    return "http://127.0.0.1:12345/static-data/" + this.getRegion() + '/v1.2';
  }
  
  private LinkSummoner()
  {
    return "http://127.0.0.1:12345/" + this.getRegion() + '/v1.4/summoner';
  }
  
  private LinkGame()
  {
    return "http://127.0.0.1:12345/" + this.getRegion() + '/v1.3/game';
  }
  
  private getRegion()
  {
    return this.params.get('region').toLowerCase();
  }
}