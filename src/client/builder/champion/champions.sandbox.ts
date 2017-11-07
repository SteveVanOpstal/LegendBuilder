import {Injectable} from '@angular/core';

import {LolApiService} from '../../services/lolapi.service';

@Injectable()
export class ChampionsSandbox {
  champions$ = this.lolApi.getChampions().map(res => res.data).startWith([]);

  constructor(private lolApi: LolApiService) {}
}
