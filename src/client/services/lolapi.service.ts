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
    return this.cache('https://status.leagueoflegends.com/shards').map(res => {
      res.push({name: 'Public Beta Environment', slug: 'pbe'});
      return res;
    });
  }

  public getRealm(): Observable<any> {
    return this.get(Endpoint.static, 'static-data', '/realm').map(res => {
      // both http and https are supported, realm data will return http
      if (res.cdn) {
        res.cdn = res.cdn.replace('http://', 'https://');
      }
      return res;
    });
  }

  public getLanguageStrings(): Observable<any> {
    return this.get(Endpoint.static, 'static-data', '/language-strings');
  }

  public getChampions(): Observable<any> {
    return this.get(Endpoint.static, 'static-data', '/champion?champData=info,tags');
  }

  public getChampion(championKey: string): Observable<any> {
    return this.get(
        Endpoint.static, 'static-data', '/champion/' + championKey +
            '?champData=allytips,altimages,image,partype,passive,spells,stats,tags');
  }

  public getItems(): Observable<any> {
    return this.get(Endpoint.static, 'static-data', '/item?itemListData=all');
  }

  public getMasteries(): Observable<any> {
    return this.get(Endpoint.static, 'static-data', '/mastery?masteryListData=all');
  }

  public getSummonerId(summonerName: string): Observable<any> {
    return this.get(Endpoint.match, null, '/summoner/' + summonerName);
  }

  public getMatchData(summonerName: string, championKey: string, gameTime: number, samples: number):
      Observable<any> {
    return this.get(
        Endpoint.match, null, '/match/' + summonerName + '/' + championKey + '?gameTime=' +
            gameTime + '&samples=' + samples);
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
                summonerName, championKey, settings.gameTime, settings.match.sampleSize)));
  }


  private get(endpoint: Endpoint, api: string, url: string): Observable<any> {
    return this.getUrl(endpoint, api, url).mergeMap((urlResolved) => this.cache(urlResolved));
  }

  private cache(url: string): Observable<any> {
    if (!this.cachedObservables[url]) {
      this.cachedObservables[url] =
          Observable.defer(() => this.http.get(url)).publishReplay().refCount();
    }
    return this.cachedObservables[url].take(1).map(res => res.json());
  }

  private getUrl(endpoint: Endpoint, api: string, url: string): Observable<string> {
    return this.getCurrentRegion().map(region => this.getEndpoint(endpoint, api, region) + url);
  }

  private getEndpoint(endpoint: Endpoint, api: string, region: string): string {
    switch (endpoint) {
      case Endpoint.static:
        return 'https://' + settings.domain + '/staticapi/' + api + '/' + region +
            settings.apiVersions[api];
      default:
        return 'https://' + settings.domain + '/matchapi/' + region;
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
