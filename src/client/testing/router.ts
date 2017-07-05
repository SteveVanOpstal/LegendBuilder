import {UrlSegment} from '@angular/router';
import {Observable, Observer} from 'rxjs';

export class MockRouter {
  routerState: any = {};
  region: string = 'euw';

  constructor() {
    this.routerState = this.routerState_();
  }

  setRegion(region: string) {
    this.region = region;
    this.routerState = this.routerState_();
  }

  navigate(_commands: any[], _extras?: any): any {}

  private routerState_(): any {
    return {
      root: {
        children: [{
          url: Observable.create((observer: Observer<UrlSegment[]>) => {
            observer.next([
              new UrlSegment('build', {}), new UrlSegment(this.region, {}),
              new UrlSegment('DinosHaveNoLife', {}), new UrlSegment('Velkoz', {})
            ]);
          })
        }]
      }
    };
  }
}

export class MockActivatedRoute {
  snapshot: any;
  params: any;
  private _params = {region: 'euw', summoner: 'DinosHaveNoLife', champion: 'VelKoz'};
  constructor(params?: any) {
    this._params = params || this._params;
    this.snapshot = {params: this._params};
    this.params = {subscribe: (fn) => fn(this._params)};
  }
}
