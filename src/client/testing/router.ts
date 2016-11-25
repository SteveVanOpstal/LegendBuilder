import {UrlSegment} from '@angular/router';
import {Observable, Observer} from 'rxjs/Rx';

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

  navigate(commands: any[], extras?: any): any {}

  private routerState_(): any {
    return {
      root: {
        children: [{
          url: Observable.create((observer: Observer<UrlSegment[]>) => {
            observer.next([
              {path: 'build', parameters: {}}, {path: this.region, parameters: {}},
              {path: 'DinosHaveNoLife', parameters: {}}, {path: 'Velkoz', parameters: {}}
            ]);
          })
        }]
      }
    };
  };
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
