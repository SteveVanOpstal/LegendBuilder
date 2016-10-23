import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {settings} from '../../../config/settings';
import {config} from '../build/graph/config';
import {Item} from '../build/item';
import {Samples} from '../build/samples';
import {BuildService} from '../services/build.service';

import {LolApiService} from './lolapi.service';

interface Stat {
  name: string;
  value: number;
  flat: boolean;
  perLevel: boolean;
}

type Stats = Array<Object>;

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
    spellblock: 'Spell Block',
    movespeed: 'Movement Speed',
    attackspeedoffset: 'Attack Speed Offset',
    crit: 'Critical Strike'
  };

  private itemStats: Array<{item: Item, stats: Array<Stat>}>;
  private championStats: Array<Stat>;

  constructor(private router: Router, private build: BuildService, private lolApi: LolApiService) {
    build.pickedItems.subscribe(items => this.processItemStats(items));
    build.samples.subscribe(samples => this.calculateLevelTimeMarks(samples));
    let championKey = this.router.routerState.snapshot.root.children[0].url[3].path;
    this.lolApi.getChampion(championKey).subscribe(res => this.processChampionStats(res));
  }

  processItemStats(items: Array<Item>) {
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
    this.itemStats.push({item: item, stats: this.translateStats(item.stats)});
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
          stats[stat.name] = {};
          stats[stat.name][0] = 0;
        }
      }
      this.calculateStats(this.championStats, stats);
    }

    if (this.itemStats) {
      for (let item of this.itemStats) {
        for (let stat of item.stats) {
          if (!stats[stat.name]) {
            stats[stat.name] = {};
            stats[stat.name][0] = 0;
          }
        }
        this.calculateStats(item.stats, stats, item.item.time);
      }
    }

    stats = this.makeIterative(stats);
    this.build.stats.notify(stats);
  }

  calculateStats(stats: Array<Stat>, resultStats: Stats, time: number = 0): void {
    // flat
    for (let stat of stats) {
      if (stat.flat) {
        if (stat.perLevel) {
          this.addStatPerLevel(resultStats, stat, time);
        } else {
          this.addStat(resultStats, stat, time);
        }
      }
    }

    // percentage
    for (let stat of stats) {
      if (!stat.flat) {
        if (stat.perLevel) {
          this.addStatPerLevel(resultStats, stat, time);
        } else {
          this.addStat(resultStats, stat, time);
        }
      }
    }
  }

  addStatPerLevel(stats: Stats, stat: Stat, time: number = 0) {
    if (this.levelTimeMarks) {
      for (let t of this.levelTimeMarks) {
        if (t >= time) {
          this.addStat(stats, stat, t);
        }
      }
    }
  }

  addStat(stats: Stats, stat: Stat, time: number) {
    if (stats[stat.name] && stats[stat.name][time]) {
      let sample = stats[stat.name][time];
      stats[stat.name][time] = stat.flat ? sample + stat.value : sample * stat.value;
    } else {
      stats[stat.name][time] = stat.value;
    }
  }

  calculateLevelTimeMarks(samples: Samples) {
    let lastXpMark = samples.xp[samples.xp.length - 1];
    this.levelTimeMarks = [];
    for (let xpMark of config.levelXp) {
      this.levelTimeMarks.push(xpMark / lastXpMark * settings.gameTime);
    }
    this.calculate();
  }

  makeIterative(stats: Stats): Array<Array<{time: number, value: number}>> {
    let result = [];
    for (let name in stats) {
      let arr = Array<{time: number, value: number}>();
      for (let time in stats[name]) {
        arr.push({time: parseInt(time, 10), value: stats[name][time]});
      }
      arr.sort((a, b) => {
        return a.time > b.time ? 1 : -1;
      });
      let value = 0;
      for (let index in arr) {
        value += arr[index].value;
        arr[index].value = value;
      }
      result[name] = arr;
    }
    return result;
  }
}
