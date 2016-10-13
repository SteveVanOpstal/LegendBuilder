import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';

import {settings} from '../../../config/settings';

@Injectable()
export class LolApiService {
  public links = {
    static: 'http://' + settings.staticServer.host + ':' + settings.staticServer.port,
    match: 'http://' + settings.matchServer.host + ':' + settings.matchServer.port
  };

  private cachedObservables: Array<Observable<any>> = new Array<Observable<any>>();

  constructor(private http: Http, private router: Router) {}

  public getRegion(): Observable<string> {
    return Observable.create(observer => {
      let region = this.router.routerState.snapshot.root.children[0].url[1].path;
      if (region) {
        region = region.toLowerCase();
        this.getRegions().subscribe(
            (regions: Array<string>) => {
              if (regions.some((r: any) => {
                    return r.slug === region;
                  })) {
                observer.next(region);
                observer.complete();
              } else {
                observer.error();
              }
            },
            () => {
              observer.error();
            });
      } else {
        observer.error();
      }
    });
  }

  public getRegions(): Observable<any> {
    return this.cache('http://status.leagueoflegends.com/shards');
  public getRealm(): Observable<any> {
    return this.get(region => this.linkStaticData(region) + '/realm');
  }

  public getChampions(): Observable<any> {
    return this.get(region => this.linkStaticData(region) + '/champion?champData=info,tags');
  }

  public getChampion(championKey: string): Observable<any> {
    return this.get(
        region => this.linkStaticData(region) + '/champion/' + championKey +
            '?champData=allytips,altimages,image,partype,passive,spells,stats,tags');
  }

  public getItems(): Observable<any> {
    return this.get(region => this.linkStaticData(region) + '/item?itemListData=all');
  }

  public getMasteries(): Observable<any> {
    return this.get(region => this.linkStaticData(region) + '/mastery?masteryListData=all');
  }

  public getSummonerId(summonerName: string): Observable<any> {
    return this.get(region => this.linkMatchData(region) + '/summoner/' + summonerName);
  }

  public getMatchData(summonerName: string, championKey: string, gameTime: number, samples: number):
      Observable<any> {
    return this.get(
        region => this.linkMatchData(region) + '/match/' + summonerName + '/' + championKey +
            '?gameTime=' + gameTime + '&samples=' + samples);
  }

  private get(url: (region: string) => string): Observable<any> {
    return Observable.create(observer => {
      this.getUrl(url).subscribe(
          (urlResolved: string) => {
            this.cache(urlResolved)
                .subscribe(
                    res => {
                      observer.next(res);
                      observer.complete();
                    },
                    () => {
                      observer.error();
                    });
          },
          () => {
            observer.error();
          });
    });
  }

  private cache(url: string): Observable<any> {
    if (!this.cachedObservables[url]) {
      this.cachedObservables[url] = this.http.get(url).cache();
    }
    return this.cachedObservables[url].map(res => res.json());
  }

  private getUrl(url: (region: string) => string): Observable<string> {
    return this.getRegion().map(region => url(region));
  }

  private linkStaticData(region: string) {
    return this.links.static + '/static-data/' + region + '/v1.2';
  }

  private linkMatchData(region: string) {
    return this.links.match + '/' + region;
  }
}
