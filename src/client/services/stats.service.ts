import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Rx';

import {settings} from '../../../config/settings';
import {config} from '../build/graph/config';
import {Item} from '../build/item';
import {Samples} from '../build/samples';

import {LolApiService} from './lolapi.service';

interface Stat {
  name: string;
  value: number;
  time: number;
  flat: boolean;
  perLevel: boolean;
}

type StatArray = Array<Stat>;

export type Stats = {
  [name: string]: [{time: number, value: number}]
};
export type Items = Array<Item>;

@Injectable()
export class StatsService {
  stats = new Subject<Stats>();
  pickedItems = new Subject<Items>();

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
    spellblock: 'Spell Block',
    movespeed: 'Movement Speed',
    attackspeedoffset: 'Attack Speed Offset',
    crit: 'Critical Strike'
  };

  private items: any;
  private champion: any;

  constructor(private lolApi: LolApiService) {
    this.lolApi.getCurrentMatchData().subscribe(samples => {
      this.createLevelTimeMarks(samples);
      this.process();
    });
    this.lolApi.getCurrentChampion().subscribe(champion => {
      this.champion = champion;
      this.process();
    });
    this.pickedItems.subscribe((items) => {
      this.items = items;
      this.process();
    });
  }

  private process() {
    if (!this.levelTimeMarks || this.levelTimeMarks.length <= 0) {
      return;
    }

    let stats: StatArray = [];
    stats = this.translateItemStats(stats);
    stats = this.translateChampionStats(stats);

    stats = this.calculate(stats);

    this.stats.next(this.makeIterable(stats));
  }

  private translateItemStats(stats: StatArray): StatArray {
    if (this.items) {
      for (let item of this.items) {
        // remove stats that belong to items that builds into this item
        let itemStats = {...item.stats};
        for (let containedItem of item.contains) {
          for (let stat in containedItem.stats) {
            if (itemStats[stat]) {
              itemStats[stat] -= containedItem.stats[stat];
            }
          }
        }
        stats = stats.concat(this.translateStats(itemStats, item.time));
      }
    }
    return stats;
  }

  private translateChampionStats(stats: StatArray): StatArray {
    if (this.champion) {
      stats = stats.concat(this.translateStats(this.champion.stats));
    }
    return stats;
  }

  private translateStats(stats: any, time: number = 0): StatArray {
    let result = [];
    for (let name in stats) {
      let stat = this.parseName(name);
      stat.value = stats[name];
      stat.time = time;
      result.push(stat);
    }
    return result;
  }

  private parseName(name: string): Stat {
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
        let charPrev = name[i - 1];
        if (char === char.toUpperCase() && charPrev === charPrev.toLowerCase()) {
          name = name.substr(0, i) + ' ' + name.substr(i);
          i++;
        }
      }
    }

    return {name: name, value: 0, time: 0, flat: flat, perLevel: perLevel};
  }

  private calculate(stats: StatArray): StatArray {
    if (!stats || stats.length <= 0) {
      return [];
    }

    let statsFlat: StatArray = this.getStats(stats, true);
    let statsPercent: StatArray = this.getStats(stats, false);

    let result: StatArray = [];
    for (let nameFlat in statsFlat) {
      let times = Object.keys(statsFlat[nameFlat]);
      if (statsPercent[nameFlat]) {
        let timesPercentage = Object.keys(statsPercent[nameFlat]);
        times = times.concat(timesPercentage);
      }
      for (let time of times.filter((value, index, array) => {
             return array.indexOf(value) === index;
           })) {
        this.cumulateStats(result, statsFlat, statsPercent, nameFlat, parseInt(time, 10));
      }
    }
    return result;
  }

  private getStats(stats: StatArray, flat: boolean): StatArray {
    let result: StatArray = [];
    for (let stat of stats) {
      if (stat.flat === flat) {
        if (stat.perLevel) {
          this.addStatPerLevel(result, stat.name, stat.value, stat.time);
        } else {
          this.addStat(result, stat.name, stat.value, stat.time);
        }
      }
    }
    return result;
  }

  private addStatPerLevel(stats: StatArray, name: string, value: number, time: number) {
    if (this.levelTimeMarks) {
      for (let t of this.levelTimeMarks) {
        if (t >= time) {
          this.addStat(stats, name, value, t);
        }
      }
    }
  }

  private addStat(stats: StatArray, name: string, value: number, time: number) {
    if (!stats[name]) {
      stats[name] = {};
      stats[name][0] = 0;
    }

    if (stats[name][time]) {
      let sample = stats[name][time];
      stats[name][time] = sample + value;
    } else {
      stats[name][time] = value;
    }
  }

  private cumulateStats(
      stats: StatArray, statsFlat: StatArray, statsPercent: StatArray, name: string, time: number) {
    let valueFlat = this.cumulatedStat(statsFlat, name, time);
    let valuePercent = this.cumulatedStat(statsPercent, name, time);
    if (valueFlat > 0) {
      let value = Math.round((valueFlat * (1 + valuePercent)) * 100) / 100;
      this.addStat(stats, name, value, time);
    }
  }

  private cumulatedStat(stats: StatArray, name: string, time: number) {
    let value = 0;
    if (stats[name]) {
      for (let t in stats[name]) {
        if (parseInt(t, 10) <= time) {
          value += stats[name][t];
        }
      }
    }
    return value;
  }

  private makeIterable(stats: StatArray): Stats {
    let result = {};
    for (let name in stats) {
      let arr = Array<{time: number, value: number}>();
      for (let time in stats[name]) {
        arr.push({time: parseInt(time, 10), value: stats[name][time]});
      }
      arr.sort((a, b) => {
        return a.time > b.time ? 1 : -1;
      });
      let last = arr[arr.length - 1];
      arr.push({time: settings.gameTime, value: last.value});
      result[name] = arr;
    }
    return result;
  }

  private createLevelTimeMarks(samples: Samples) {
    let lastXpMark = samples.xp[samples.xp.length - 1];
    if (!lastXpMark) {
      return;
    }
    this.levelTimeMarks = [];
    for (let xpMark of config.levelXp) {
      this.levelTimeMarks.push(Math.round(xpMark / lastXpMark * settings.gameTime));
    }
  }
}
