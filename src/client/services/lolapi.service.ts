import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';

import {settings} from '../../../config/settings';
import {environment} from '../../environments/environment';

export enum Endpoint {
  static,
  match
}

@Injectable()
export class LolApiService {
  private cachedObservables: Array<Observable<any>> = new Array<Observable<any>>();

  constructor(private http: Http, private router: Router) {}

  public getRegions(): Observable<any> {
    return this.cache(this.getEndpoint(Endpoint.static) + 'all/status/shard-data');
  }

  public getRealm(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/realms').map(res => {
      // both http and https are supported but realm data will return http as cdn
      if (res.cdn) {
        res.cdn = res.cdn.replace('http://', 'https://');
      }
      return res;
    });
  }

  public getLanguageStrings(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/language-strings');
  }

  public getChampions(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/champions?tags=image&tags=info&tags=tags');
  }

  public getChampion(championKey: string): Observable<any> {
    return this.get(
        Endpoint.static, 'static-data/champions/' + championKey +
            '?tags=allytips&tags=image&tags=passive&tags=spells&tags=stats&tags=tags');
  }

  public getItems(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/items?tags=all');
  }

  public getMasteries(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/mastery?masteryListData=all');
  }

  public getAccountId(summonerName: string): Observable<any> {
    return this.get(Endpoint.match, 'summoner/' + summonerName);
  }

  public getMatchData(summonerName: string, championKey: string, gameTime: number, samples: number):
      Observable<any> {
    return this.get(
        Endpoint.match, 'match/' + summonerName + '/' + championKey + '?gameTime=' + gameTime +
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
                summonerName, championKey, settings.gameTime, settings.match.sampleSize)));
  }


  private get(endpoint: Endpoint, url: string): Observable<any> {
    return this.getUrl(endpoint, url).mergeMap((urlResolved) => this.cache(urlResolved));
  }

  private cache(url: string): Observable<any> {
    if (!this.cachedObservables[url]) {
      this.cachedObservables[url] =
          Observable
              .defer(() => this.http.get(url).retryWhen(errors => {
                return errors.zip(Observable.range(1, 4)).flatMap(([error, i]) => {
                  try {
                    this.abort('Bad request', error, 400);
                    this.abort('Unauthorised', error, 401);
                    this.abort('Forbidden', error, 403);
                    this.abort('Not Found', error, 404);
                  } catch (e) {
                    return Observable.throw(e);
                  }

                  console.error('Retry attempt [' + i + '/4].. (' + error + ')');
                  if (i > 3) {
                    return Observable.throw(error);
                  }
                  return Observable.timer(i * 500);
                });
              }))
              .publishReplay()
              .refCount()
              .catch(err => Observable.throw(err));
    }
    return this.cachedObservables[url].take(1).map(res => res.json());
  }

  private abort(name: string, error, statusCode: number) {
    if (error.status && error.status === statusCode) {
      const text = name + ', not attempting a retry. (' + error + ')';
      console.error(text);
      throw Error(text);
    }
  }

  private getUrl(endpoint: Endpoint, url: string): Observable<string> {
    return this.getCurrentRegion().map(region => this.getEndpoint(endpoint) + region + '/' + url);
  }

  private getEndpoint(endpoint: Endpoint): string {
    switch (endpoint) {
      case Endpoint.static:
        return environment.production ?
            'https://' + settings.domain + '/staticapi/' :
            'https://' + settings.host + ':' + settings.static.port + '/';
      default:
        return environment.production ?
            'https://' + settings.domain + '/matchapi/' :
            'https://' + settings.host + ':' + settings.match.port + '/';
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
    return this.getRegions().map((regions: Array<any>) => {
      const foundRegion = regions.find((r: any) => {
        return r.slug === region;
      });
      if (foundRegion) {
        return foundRegion['hostname'].split('.')[1];
      }
    });
  }
}
