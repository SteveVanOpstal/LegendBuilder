import {Injectable} from '@angular/core';

import {LolApiService} from '../../services/lolapi.service';

@Injectable()
export class RegionsSandbox {
  regions$ = this.lolApi.getRegions().startWith([]);

  constructor(private lolApi: LolApiService) {}
}
