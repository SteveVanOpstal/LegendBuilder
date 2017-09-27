import {Injectable} from '@angular/core';

import {LolApiService} from '../../services';

@Injectable()
export class RegionsSandbox {
  regions$ = this.lolApi.getRegions().startWith([]);

  constructor(private lolApi: LolApiService) {}
}
