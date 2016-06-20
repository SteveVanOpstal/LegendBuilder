import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translate'})

export class TranslatePipe implements PipeTransform {
  translator: Object = {
    GOLDPER: 'Gold income',
    TRINKET: 'Trinkets',
    SPELLBLOCK: 'Magic resist',
    HEALTHREGEN: 'Health regen',
    CRITICALSTRIKE: 'Critical strike',
    SPELLDAMAGE: 'Ability power',
    COOLDOWNREDUCTION: 'Cooldown reduction',
    MANAREGEN: 'Mana regen',
    NONBOOTSMOVEMENT: 'Other',
    ARMORPENETRATION: 'Armor penetration',
    AURA: 'Area Of Effect',
    MAGICPENETRATION: 'Magic penetration',
    ONHIT: 'On hit effect',
    SPELLVAMP: 'Spell vamp',
    UNCATEGORIZED: 'Other'
  };

  transform(value: string) {
    if (this.translator[value]) {
      return this.translator[value];
    }
    return value;
  }
}
