import {Injectable, bind} from '@angular/core';
import {Http, Headers, Response, BaseResponseOptions} from '@angular/http';
import {RouteSegment} from '@angular/router';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {settings} from '../../../settings';

@Injectable()
export class LolApiService {
  public staticServer = settings.server.staticServer;
  public matchServer = settings.server.matchServer;

  private realm: Observable<Response>;
  private region: string;

  constructor(private current: RouteSegment, private http: Http) { }


  public getRealm(): Observable<Response> {
    if (!this.realm) {
      this.realm = this.http.get(this.linkStaticData() + '/realm')
        .map(res => res.json())
        .cache();
    }
    return this.realm;
  }

  public getRegions() {
    return this.http.get('http://status.leagueoflegends.com/shards')
      .map(res => res.json());
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

  public getSummonerId(summonerName: string, championKey: string) {
    return this.http.get(this.linkMatchData() + '/summoner/' + summonerName + '/' + championKey)
      .map(res => res.json());
  }

  public getMatchData(summonerName: string, championKey: string, gameTime: number, samples: number) {
    return this.http.get(this.linkMatchData() + '/match/' + summonerName + '/' + championKey + '?gameTime=' + gameTime + '&samples=' + samples)
      .map(res => res.json());
  }


  private linkStaticData() {
    return this.linkStaticServer() + '/static-data/' + this.getCurrentRegion() + '/v1.2';
  }

  private linkMatchData() {
    return this.linkMatchServer() + '/' + this.getCurrentRegion();
  }

  private linkStaticServer() {
    return 'http://' + this.staticServer.host + ':' + this.staticServer.port;
  }

  private linkMatchServer() {
    return 'http://' + this.matchServer.host + ':' + this.matchServer.port;
  }

  private getCurrentRegion() {
    if (!this.region) {
      this.region = this.current.getParam('region').toLowerCase();
    }
    return this.region;
  }
}
