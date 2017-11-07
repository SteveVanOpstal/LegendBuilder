import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {settings} from '../../../../../config/settings';
import {config} from '../../../builder/build/graph/config';
import {Item} from '../../../data/item';
import {Samples} from '../../../data/samples';
import {LolApiService} from '../../../services/lolapi.service';
import {TranslatePipe} from '../../../shared/translate.pipe';
import {BuildSandbox} from '../build.sandbox';

interface Stat {
  name: string;
  value: number;
  time: number;
  flat: boolean;
  perLevel: boolean;
}

type StatArray = Array<Stat>;

export interface Stats { [name: string]: [{time: number, value: number}]; }
export type Items = Array<Item>;

@Injectable()
export class StatsService {
  stats$ = new Subject<Stats>();

  private levelTimeMarks: Array<number>;

  private items: Array<Item>;
  private champion: any;

  private translator: TranslatePipe;

  constructor(private sb: BuildSandbox, lolApi: LolApiService) {
    this.sb.matchdata$.subscribe(samples => {
      this.createLevelTimeMarks(samples);
      this.process();
    });
    this.sb.champion$.subscribe(champion => {
      this.champion = champion;
      this.process();
    });
    this.sb.pickedItems$.subscribe((items) => {
      this.items = items;
      this.process();
    });

    this.translator = new TranslatePipe(lolApi);
  }

  private process() {
    if (!this.levelTimeMarks || this.levelTimeMarks.length <= 0) {
      return;
    }

    let stats: StatArray = [];
    stats = this.translateItemStats(stats);
    stats = this.translateChampionStats(stats);

    stats = this.calculate(stats);

    this.stats$.next(this.makeIterable(stats));
  }

  private translateItemStats(stats: StatArray): StatArray {
    if (this.items) {
      for (const item of this.items) {
        // remove stats that belong to items that builds into this item
        const itemStats = {...item.stats};
        for (const containedItem of item.contains) {
          for (const stat in containedItem.stats) {
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
    const result = [];
    for (const name of Object.keys(stats)) {
      const stat = this.parseName(name);
      stat.value = stats[name];
      stat.time = time;
      result.push(stat);
    }
    return result;
  }

  private parseName(name: string): Stat {
    let flat = true;
    if (name.indexOf('Percent') >= 0) {
      flat = false;
      name = name.substr(7);
    } else if (name.indexOf('Flat') === 0) {
      name = name.substr(4);
    }

    let perLevel = false;
    if (name.indexOf('PerLevel') >= 0 || name.indexOf('perlevel') >= 0) {
      perLevel = true;
      name = name.substr(0, name.length - 8);
    }

    if (name.indexOf('Mod') > 0) {
      name = name.substr(0, name.length - 3);
    }

    name = this.translator.transform(name);

    for (let i = 1; i < name.length; i++) {
      const char = name[i];
      const charPrev = name[i - 1];
      if (char === char.toUpperCase() && charPrev === charPrev.toLowerCase()) {
        name = name.substr(0, i) + ' ' + name.substr(i);
        i++;
      }
    }

    if (name[0] !== name[0].toUpperCase()) {
      name = name[0].toUpperCase() + name.substr(1);
    }

    return {name: name, value: 0, time: 0, flat: flat, perLevel: perLevel};
  }

  private calculate(stats: StatArray): StatArray {
    if (!stats || stats.length <= 0) {
      return [];
    }

    const statsFlat: StatArray = this.getStats(stats, true);
    const statsPercent: StatArray = this.getStats(stats, false);

    const result: StatArray = [];
    for (const nameFlat of Object.keys(statsFlat)) {
      let times = Object.keys(statsFlat[nameFlat]);
      if (statsPercent[nameFlat]) {
        const timesPercentage = Object.keys(statsPercent[nameFlat]);
        times = times.concat(timesPercentage);
      }
      for (const time of times.filter((value, index, array) => {
             return array.indexOf(value) === index;
           })) {
        this.cumulateStats(result, statsFlat, statsPercent, nameFlat, parseInt(time, 10));
      }
    }
    return result;
  }

  private getStats(stats: StatArray, flat: boolean): StatArray {
    const result: StatArray = [];
    for (const stat of stats) {
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
      for (const t of this.levelTimeMarks) {
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
      const sample = stats[name][time];
      stats[name][time] = sample + value;
    } else {
      stats[name][time] = value;
    }
  }

  private cumulateStats(
      stats: StatArray, statsFlat: StatArray, statsPercent: StatArray, name: string, time: number) {
    const valueFlat = this.cumulatedStat(statsFlat, name, time);
    const valuePercent = this.cumulatedStat(statsPercent, name, time);
    if (valueFlat > 0) {
      const value = Math.round((valueFlat * (1 + valuePercent)) * 100) / 100;
      this.addStat(stats, name, value, time);
    }
  }

  private cumulatedStat(stats: StatArray, name: string, time: number) {
    let value = 0;
    if (stats[name]) {
      for (const t in stats[name]) {
        if (parseInt(t, 10) <= time) {
          value += stats[name][t];
        }
      }
    }
    return value;
  }

  private makeIterable(stats: StatArray): Stats {
    const result = {};
    for (const name of Object.keys(stats)) {
      const arr = Array<{time: number, value: number}>();
      for (const time of Object.keys(stats[name])) {
        arr.push({time: parseInt(time, 10), value: stats[name][time]});
      }
      arr.sort((a, b) => {
        return a.time > b.time ? 1 : -1;
      });
      const last = arr[arr.length - 1];
      arr.push({time: settings.gameTime, value: last.value});
      result[name] = arr;
    }
    return result;
  }

  private createLevelTimeMarks(samples: Samples) {
    const lastXpMark = samples.xp[samples.xp.length - 1];
    if (!lastXpMark) {
      return;
    }
    this.levelTimeMarks = [];
    for (const xpMark of config.levelXp) {
      this.levelTimeMarks.push(Math.round(xpMark / lastXpMark * settings.gameTime));
    }
  }
}
