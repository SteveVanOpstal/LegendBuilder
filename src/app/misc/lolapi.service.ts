import {Injectable, bind} from 'angular2/core';
import {Http, Headers, Response, BaseResponseOptions} from 'angular2/http';
import {RouteParams} from 'angular2/router';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {settings} from '../../server/settings';

@Injectable()
export class LolApiService {
  public realm: Observable<Response>;
  public staticServer = settings.staticServer;
  public matchServer = settings.matchServer;

  private region: string;

  constructor(params: RouteParams, private http: Http) {
    this.region = params.get('region').toLowerCase();

    this.realm = this.http.get(this.linkStaticData() + '/realm')
      .map(res => res.json())
      .cache();
  }


  public getRealm(): Observable<Response> {
    return this.realm;
  }

  public getChampions() {
    return this.http.get(this.linkStaticData() + '/champion?champData=info,tags')
      .map(res => res.json());
  }

  public getChampion(championKey: string) {
    return this.http.get(this.linkStaticData() + '/champion/' + championKey + '?champData=allytips,altimages,image,partype,passive,spells,stats,tags')
      .map(res => res.json());
  }

  public getItems() {
    return this.http.get(this.linkStaticData() + '/item?itemListData=all')
      .map(res => res.json());
  }

  public getMasteries() {
    return this.http.get(this.linkStaticData() + '/mastery?masteryListData=all')
      .map(res => res.json());
  }

  public getSummonerMatchData(summonerName: string, championKey: string, gameTime: number, samples: number) {
    return this.http.get(this.linkMatchData() + '/' + summonerName + '/' + championKey + '?gametime=' + gameTime + '&samples=' + samples)
      .map(res => res.json());
  }


  private linkStaticData() {
    return this.linkStaticServer() + 'static-data/' + this.region + '/v1.2';
  }

  private linkMatchData() {
    return this.linkMatchServer() + this.region;
  }

  private linkStaticServer() {
    return 'http://' + (this.staticServer.host || 'localhost') + ':' + (this.staticServer.port || 8081) + '/';
  }

  private linkMatchServer() {
    return 'http://' + (this.matchServer.host || 'localhost') + ':' + (this.matchServer.port || 8082) + '/';
  }
}
