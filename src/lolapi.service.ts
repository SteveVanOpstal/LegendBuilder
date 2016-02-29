///<reference path="typings/angular2/angular2.d.ts"/>

import {Injectable, bind} from 'angular2/core';
import {Http, Headers, Response, BaseResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';

import 'rxjs/rx';

import {staticServer, matchServer} from 'app/serverConfig';

@Injectable()
export class LolApiService {
  region: string;
  realm: any;
  
  constructor(params: RouteParams, private http: Http) {
    this.region = params.get('region').toLowerCase();
    
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

  public getChampion(championKey: string) {
    return this.http.get(this.linkStaticData() + '/champion/' + championKey + '?champData=allytips,altimages,image,partype,passive,spells,stats,tags')
      .map(res => res = this.handleResponse(res));
  }

  public getItems() {
    return this.http.get(this.linkStaticData() + '/item?itemListData=all')
      .map(res => res = this.handleResponse(res));
  }

  public getMasteries() {
    return this.http.get(this.linkStaticData() + '/mastery?masteryListData=all')
      .map(res => res = res.json());
  }

  public getSummonerMatchData(summonerName: string, championKey: string, gameTime: number, samples: number) {
    return this.http.get(this.matchServer() + '/' + summonerName + '/' + championKey + '?gametime=' + gameTime + '&samples=' + samples)
      .map(res => res.json());
  }
  
  
  private linkStaticData() {
    return this.staticServer() + "static-data/" + this.region + '/v1.2';
  }
  
  private linkSummoner() {
    return this.staticServer() + this.region + '/v1.4/summoner';
  }
  
  
  private staticServer() {
    return "http://" + staticServer.host + ":" + staticServer.port + "/";
  }
  
  private matchServer() {
    return "http://" + matchServer.host + ":" + matchServer.port + "/" + this.region;
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
}