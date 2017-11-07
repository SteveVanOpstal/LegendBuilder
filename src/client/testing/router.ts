export class MockRouter {
  region = 'euw';

  setRegion(region: string) {
    this.region = region;
  }

  navigate(_commands: any[], _extras?: any): any {}

  parseUrl() {
    return {
      root: {children: {primary: {segments: ['build', this.region, 'DinosHaveNoLife', 'VelKoz']}}}
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
