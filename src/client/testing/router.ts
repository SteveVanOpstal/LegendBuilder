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
