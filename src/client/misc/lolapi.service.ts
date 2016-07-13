import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';

import {settings} from '../../../config/settings';

@Injectable()
export class LolApiService {
  public staticServer = settings.staticServer;
  public matchServer = settings.matchServer;

  private cachedObservables: Array<Observable<any>> = new Array<Observable<any>>();

  constructor(private route: ActivatedRoute, private http: Http) {}

  public getRealm(): Observable<any> {
    return this.get(region => this.linkStaticData(region) + '/realm');
  }

  public getRegions(): Observable<any> {
    return this.cache('http://status.leagueoflegends.com/shards');
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

  public getSummonerId(summonerName: string, championKey: string): Observable<any> {
    return this.get(
        region => this.linkMatchData(region) + '/summoner/' + summonerName + '/' + championKey);
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

  private getRegion(): Observable<string> {
    return Observable.create(observer => {
      this.route.params.subscribe(params => {
        if (!params['region']) {
          observer.error();
          return;
        }
        this.getRegions().subscribe((regions: Array<string>) => {
          let region = params['region'].toLowerCase();
          if (regions.some((r: any) => {
                return r.slug === region;
              })) {
            observer.next(region);
            observer.complete();
            return;
          }
          observer.error();
        });
      });
    });
  }


  private linkStaticData(region: string) {
    return this.linkStaticServer() + '/static-data/' + region + '/v1.2';
  }

  private linkMatchData(region: string) {
    return this.linkMatchServer() + '/' + region;
  }

  private linkStaticServer() {
    return 'http://' + this.staticServer.host + ':' + this.staticServer.port;
  }

  private linkMatchServer() {
    return 'http://' + this.matchServer.host + ':' + this.matchServer.port;
  }
}
