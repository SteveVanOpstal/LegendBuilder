import {Injectable} from '@angular/core';

import {LolApiService} from '../services';

@Injectable()
export class SummonerSandbox {
  constructor(private lolApi: LolApiService) {}

  getAccountId(name: string) {
    return this.lolApi.getAccountId(name);
  }
}
