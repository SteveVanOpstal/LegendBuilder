import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {settings} from '../../../../config/settings';
import {LolApiService} from '../../services/lolapi.service';
import {config} from '../graph/config';
import {Item} from '../item';
import {Samples} from '../samples';
import {BuildService} from '../services/build.service';

interface Stat {
  name: string;
  value: number;
  flat: boolean;
  perLevel: boolean;
}

@Injectable()
export class StatsService {
  private levelTimeMarks: Array<number>;

  private translator: Object = {
    MPPool: 'MP',
    HPPool: 'HP',
    EnergyPool: 'Energy',
    EXPBonus: 'Experience Bonus',
    CritDamage: 'Critical Strike',
    CritChance: 'Critical Strike Chance',
    TimeDead: 'Time spend Dead',
    GoldPer10: 'Gold per 10 seconds',

    mp: 'MP',
    hp: 'HP',
    hpregen: 'HP regen',
    mpregen: 'MP regen',
    attackdamage: 'Attack Damage',
    attackrange: 'Attack Range',
    attackspeed: 'Attack Speed',
    armor: 'Armor',
    spellblock: 'Spell Block',
    movespeed: 'Movement Speed',
    attackspeedoffset: 'Attack Speed Offset',
    crit: 'Critical Strike'
  };

  private itemStats: Array<Stat>;
  private championStats: Array<Stat>;

  constructor(
      private route: ActivatedRoute, private build: BuildService, private lolApi: LolApiService) {
    build.pickedItems.subscribe(this.processItemStats);
    build.samples.subscribe(this.calculateLevelTimeMarks);
    let championKey = this.route.snapshot.params['champion'];
    this.lolApi.getChampion(championKey).subscribe(res => this.processChampionStats(res));
  }

  processItemStats =
      (items: Array<Item>) => {
        this.translateItems(items);
        this.calculate();
      }

  translateItems(items: Array<Item>) {
    this.itemStats = [];
    for (let item of items) {
      this.translateItem(item);
    }
  }

  translateItem(item: Item) {
    this.itemStats[item.time] = this.translateStats(item.stats);
  }

  processChampionStats(champion: any) {
    this.championStats = this.translateStats(champion.stats);
    this.calculate();
  }

  translateStats(stats: any): any {
    let result = [];
    for (let name in stats) {
      let stat = this.parseName(name);
      stat.value = stats[name];
      result.push(stat);
    }
    return result;
  }

  parseName(name: string): Stat {
    if (name.indexOf('r') === 0) {
      name = name.substr(1);
    }

    let flat = true;
    if (name.indexOf('Percent') === 0) {
      flat = false;
      name = name.substr(7);
    } else if (name.indexOf('Flat') === 0) {
      flat = true;
      name = name.substr(4);
    }

    let perLevel = false;
    if (name.indexOf('PerLevel') > 0 || name.indexOf('perlevel') > 0) {
      perLevel = true;
      name = name.substr(0, name.length - 8);
    }

    if (name.indexOf('Mod') > 0) {
      name = name.substr(0, name.length - 3);
    }


    let translation = this.translator[name];
    if (translation) {
      name = this.translator[name];
    } else {
      for (let i = 1; i < name.length; i++) {
        let char = name[i];
        if (char === char.toUpperCase()) {
          name = name.substr(0, i) + ' ' + name.substr(i);
          i++;
        }
      }
    }

    return {name: name, value: 0, flat: flat, perLevel: perLevel};
  }

  calculate() {
    let stats = [];

    if (this.championStats) {
      for (let stat of this.championStats) {
        if (!stats[stat.name]) {
          stats[stat.name] = [];
          stats[stat.name][0] = {time: 0, value: 0};
        }
      }
      stats = this.calculateChampionStats(stats);
    }

    if (this.itemStats) {
      for (let stat of this.itemStats) {
        if (!stats[stat.name]) {
          stats[stat.name] = [];
          stats[stat.name][0] = {time: 0, value: 0};
        }
      }
      stats = this.calculateItemStats(stats);
    }

    this.build.stats.notify(stats);
  }

  calculateChampionStats(stats: Array<any>): Array<any> {
    // flat
    for (let stat of this.championStats) {
      if (stat.flat) {
        if (stat.perLevel) {
          this.flatPerLevel(stats, stat);
        } else {
          this.flat(stats, stat, 0);
        }
      }
    }

    // percentage
    for (let stat of this.championStats) {
      if (!stat.flat) {
        if (stat.perLevel) {
          this.percentagePerLevel(stats, stat);
        } else {
          this.percentage(stats, stat, 0);
        }
      }
    }

    return stats;
  }

  calculateItemStats(stats: Array<any>): Array<any> {
    return stats;
  }

  flat(stats: Array<Object>, stat: Stat, time: number) {
    this.addStat(stats, stat, time, true);
  }

  percentage(stats: Array<Object>, stat: Stat, time: number) {
    this.addStat(stats, stat, time, false);
  }

  flatPerLevel(stats: Array<Object>, stat: Stat) {
    this.perLevel(stats, stat, true);
  }

  percentagePerLevel(stats: Array<Object>, stat: Stat) {
    this.perLevel(stats, stat, false);
  }

  perLevel(stats: Array<Object>, stat: Stat, flat: boolean) {
    if (this.levelTimeMarks) {
      for (let time of this.levelTimeMarks) {
        this.addStat(stats, stat, time, flat);
      }
    }
  }

  addStat(stats: Array<any>, stat: Stat, time: number, flat: boolean) {
    let statSample = stats[stat.name].find((s) => {
      return s.time === time;
    });

    for (let index in stats[stat.name]) {
      let sample = stats[stat.name][index];
      if (sample.time === time) {
        stats[stat.name][index].value =
            flat ? sample.value + stat.value : sample.value * stat.value;
        return;
      }
    }

    if (stats[stat.name] && stats[stat.name].length) {
      let lastValue = stats[stat.name][stats[stat.name].length - 1].value;
      stats[stat.name].push({time: time, value: lastValue + stat.value});
    } else {
      stats[stat.name].push({time: time, value: stat.value});
    }
  }

  calculateLevelTimeMarks = (samples: Samples) => {
    let lastXpMark = samples.xp[samples.xp.length - 1];
    this.levelTimeMarks = [];
    for (let xpMark of config.levelXp) {
      this.levelTimeMarks.push(xpMark / lastXpMark * settings.gameTime);
    }
    this.calculate();
  }
}
