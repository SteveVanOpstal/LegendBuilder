import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';

import {settings} from '../../../config/settings';

export enum Endpoint {
  static,
  match
}

@Injectable()
export class LolApiService {
  private cachedObservables: Array<Observable<any>> = new Array<Observable<any>>();

  constructor(private http: Http, private router: Router) {}

  public getRegions(): Observable<any> {
    return this.cache('http://status.leagueoflegends.com/shards').map(res => {
      res.push({name: 'Public Beta Environment', slug: 'pbe'});
      return res;
    });
  }

  public getRealm(): Observable<any> {
    return this.get(Endpoint.static, '/realm');
  }

  public getChampions(): Observable<any> {
    return this.get(Endpoint.static, '/champion?champData=info,tags');
  }

  public getChampion(championKey: string): Observable<any> {
    return this.get(
        Endpoint.static, '/champion/' + championKey +
            '?champData=allytips,altimages,image,partype,passive,spells,stats,tags');
  }

  public getItems(): Observable<any> {
    return this.get(Endpoint.static, '/item?itemListData=all');
  }

  public getMasteries(): Observable<any> {
    return this.get(Endpoint.static, '/mastery?masteryListData=all');
  }

  public getSummonerId(summonerName: string): Observable<any> {
    return this.get(Endpoint.match, '/summoner/' + summonerName);
  }

  public getMatchData(summonerName: string, championKey: string, gameTime: number, samples: number):
      Observable<any> {
    return this.get(
        Endpoint.match, '/match/' + summonerName + '/' + championKey + '?gameTime=' + gameTime +
            '&samples=' + samples);
  }

  public getCurrentRegion(): Observable<string> {
    return this.getParam(1).mergeMap((region) => this.checkRegion(region));
  }

  public getCurrentChampion(): Observable<any> {
    return this.getParam(3).mergeMap((championKey) => this.getChampion(championKey));
  }

  public getCurrentMatchData(): Observable<any> {
    return this.getParam(2).mergeMap(
        (summonerName) => this.getParam(3).mergeMap(
            (championKey) => this.getMatchData(
                summonerName, championKey, settings.gameTime, settings.matchServer.sampleSize)));
  }


  private get(endpoint: Endpoint, url: string): Observable<any> {
    return this.getUrl(endpoint, url).mergeMap((urlResolved) => this.cache(urlResolved));
  }

  private cache(url: string): Observable<any> {
    if (!this.cachedObservables[url]) {
      this.cachedObservables[url] = this.http.get(url).cache();
    }
    return this.cachedObservables[url].map(res => res.json());
  }

  private getUrl(endpoint: Endpoint, url: string): Observable<string> {
    return this.getCurrentRegion().map(region => this.getEndpoint(endpoint, region) + url);
  }

  private getEndpoint(endpoint: Endpoint, region: string): string {
    switch (endpoint) {
      case Endpoint.static:
        return 'http://' + settings.staticServer.host + ':' + settings.staticServer.port +
            '/static-data/' + region + '/v1.2';
      default:
        return 'http://' + settings.matchServer.host + ':' + settings.matchServer.port + '/' +
            region;
    }
  }

  private getParam(index: number): Observable<string> {
    return this.router.routerState.root.children[0].url.map((url) => {
      if (index < url.length) {
        return url[index].path;
      } else {
        throw Error('Incorrect parameter');
      }
    });
  }

  private checkRegion(region: string): Observable<string> {
    return this.getRegions().map((regions: Array<string>) => {
      if (regions.find((r: any) => {
            return r.slug === region;
          })) {
        return region;
      } else {
        throw Error('Region does not exist');
      }
    });
  }
}
