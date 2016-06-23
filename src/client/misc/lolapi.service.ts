import 'rxjs/Rx';

import {Injectable, bind} from '@angular/core';
import {BaseResponseOptions, Headers, Http, Response} from '@angular/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {settings} from '../../../config/settings';

@Injectable()
export class LolApiService {
  public staticServer = settings.staticServer;
  public matchServer = settings.matchServer;

  private cachedObservables: Array<Observable<any>> = new Array<Observable<any>>();
  private region: string;

  constructor(route: ActivatedRoute, private http: Http) {
    route.params.subscribe(params => { this.region = params['region'].toLowerCase(); });
  }

  public getRealm(): Observable<any> { return this.cached('realm', this.linkStaticData() + '/realm'); }

  public getRegions(): Observable<any> { return this.cached('shards', 'http://status.leagueoflegends.com/shards'); }

  public getChampions(): Observable<any> { return this.cached('champions', this.linkStaticData() + '/champion?champData=info,tags'); }

  public getChampion(championKey: string): Observable<any> {
    return this.cached('champion', this.linkStaticData() + '/champion/' + championKey + '?champData=allytips,altimages,image,partype,passive,spells,stats,tags');
  }

  public getItems(): Observable<any> { return this.cached('items', this.linkStaticData() + '/item?itemListData=all'); }

  public getMasteries(): Observable<any> { return this.cached('masteries', this.linkStaticData() + '/mastery?masteryListData=all'); }

  public getSummonerId(summonerName: string, championKey: string): Observable<any> { return this.get(this.linkMatchData() + '/summoner/' + summonerName + '/' + championKey); }

  public getMatchData(summonerName: string, championKey: string, gameTime: number, samples: number): Observable<any> {
    return this.get(this.linkMatchData() + '/match/' + summonerName + '/' + championKey + '?gameTime=' + gameTime + '&samples=' + samples);
  }

  private cached(name: string, url: string): Observable<any> {
    if (!this.cachedObservables[name]) {
      this.cachedObservables[name] = this.get(url).cache();
    }
    return this.cachedObservables[name];
  }

  private get(url: string): Observable<any> { return this.http.get(url).map(res => res.json()); }


  private linkStaticData() { return this.linkStaticServer() + '/static-data/' + this.region + '/v1.2'; }

  private linkMatchData() { return this.linkMatchServer() + '/' + this.region; }

  private linkStaticServer() { return 'http://' + this.staticServer.host + ':' + this.staticServer.port; }

  private linkMatchServer() { return 'http://' + this.matchServer.host + ':' + this.matchServer.port; }
}
