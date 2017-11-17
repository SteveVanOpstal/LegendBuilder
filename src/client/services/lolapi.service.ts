import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {settings} from '../../../config/settings';
import {environment} from '../../environments/environment';

export enum Endpoint {
  static,
  match
}

@Injectable()
export class LolApiService {
  private cachedObservables = new Array<Observable<any>>();

  constructor(private http: Http, private router: Router) {}

  getRegions(): Observable<any> {
    return this.cache(this.getEndpoint(Endpoint.static) + 'all/status/shard-data');
  }

  getRealm(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/realms').map(res => {
      // both http and https are supported but realm data will return http as cdn
      if (res.cdn) {
        res.cdn = res.cdn.replace('http://', 'https://');
      }
      return res;
    });
  }

  getLanguageStrings(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/language-strings');
  }

  getChampions(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/champions?tags=image&tags=info&tags=tags');
  }

  getChampion(championKey: string): Observable<any> {
    return this.get(
        Endpoint.static,
        'static-data/champions/' + championKey +
            '?tags=allytips&tags=image&tags=passive&tags=spells&tags=stats&tags=tags');
  }

  getItems(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/items?tags=all');
  }

  getMasteries(): Observable<any> {
    return this.get(Endpoint.static, 'static-data/mastery?masteryListData=all');
  }

  getAccountId(summonerName: string): Observable<any> {
    return this.get(Endpoint.match, 'summoner/' + summonerName);
  }

  getMatchData(summonerName: string, championKey: string, gameTime: number, samples: number):
      Observable<any> {
    return this.get(
        Endpoint.match,
        'match/' + summonerName + '/' + championKey + '?gameTime=' + gameTime +
            '&samples=' + samples);
  }

  getCurrentRegion(): Observable<string> {
    return this.checkRegion(this.getParam(1));
  }

  getCurrentChampion(): Observable<any> {
    return this.getChampion(this.getParam(3));
  }

  getCurrentMatchData(): Observable<any> {
    return this.getMatchData(
        this.getParam(2), this.getParam(3), settings.gameTime, settings.match.sampleSize);
  }


  private get(endpoint: Endpoint, url: string): Observable<any> {
    return this.getUrl(endpoint, url).mergeMap(urlResolved => this.cache(urlResolved));
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
        return 'https://' + settings.domain + '/staticapi/';
      default:
        return 'https://' + settings.domain + '/matchapi/';
    }
  }

  private getParam(index: number): string {
    return this.router.parseUrl(this.router.url).root.children.primary.segments[index].toString();
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
