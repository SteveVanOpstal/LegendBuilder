import {Pipe, PipeTransform} from '@angular/core';

import {LolApiService} from '../services';

@Pipe({name: 'lbTranslate'})

export class TranslatePipe implements PipeTransform {
  private languageStrings: Object = {};

  private translator: Object = {
    AURA: 'Area Of Effect',
    ONHIT: 'On hit effect',
    UNCATEGORIZED: 'Other',

    mp: 'MP',
    hp: 'HP',
    hpregen: 'HP regen',
    mpregen: 'MP regen',
    attackdamage: 'Attack Damage',
    attackrange: 'Attack Range',
    movespeed: 'Movement Speed',
    attackspeedoffset: 'Attack Speed Offset',
    crit: 'Critical Strike'
  };
  constructor(private lolApi: LolApiService) {
    this.lolApi.getLanguageStrings().subscribe(languageStrings => {
      this.languageStrings = this.indexToLowerCase(languageStrings.data);
    });
  }

  transform(value: string): string {
    if (this.languageStrings[value.toLowerCase()]) {
      return this.languageStrings[value.toLowerCase()];
    }
    if (this.translator[value]) {
      return this.translator[value];
    }
    return value;
  }

  private indexToLowerCase(subject: Object): Object {
    const result = {};
    for (const index of Object.keys(subject)) {
      result[index.toLowerCase()] = subject[index];
    }
    return result;
  }
}
