import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {GraphComponent} from '../build/graph.component';
import {ItemsComponent} from '../build/items/items.component';
import {MasteriesComponent} from '../build/masteries/masteries.component';
import {ShopComponent} from '../build/shop/shop.component';

import {DDragonDirective} from '../misc/ddragon.directive';
import {LoadingComponent} from '../misc/loading.component';
import {ErrorComponent} from '../misc/error.component';

import {LolApiService} from '../misc/lolapi.service';

import {Config} from '../build/config';

@Component({
  providers: [LolApiService],
  directives: [GraphComponent, ItemsComponent, MasteriesComponent, ShopComponent, DDragonDirective, LoadingComponent, ErrorComponent],
  styleUrls: [
    './assets/css/build.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="title">
      <img *ngIf="champion" [ddragon]="'champion/' + champion?.image?.full">
      <h2>{{champion?.name}}</h2>
    </div>
    <div>
      <p>Summoner:<input type="text" name="name" #name><button (click)="getSummonerMatchData(name.value)">Get</button></p>
    </div>
    <graph [champion]="champion" [config]="config"></graph>
    <masteries></masteries>
    <items [items]="pickedItems" [config]="config"></items>
    <shop [(pickedItems)]="pickedItems"></shop>
    <loading [loading]="loading"></loading>
    <error [error]="error" (retry)="getData()"></error>`
})

export class BuildComponent {
  private championKey: string;
  private champion: any;
  private loading: boolean = true;
  private error: boolean = false;

  private config: Config = new Config();
  private pickedItems: Array<Object>  = [{
    'tags': [
      'Active',
      'Jungle',
      'Trinket',
      'Vision'
    ],
    'id': 3341,
    'sanitizedDescription': 'Limited to 1 Trinket. Active: Scans an area for 6 seconds, warning against hidden hostile units and revealing / d',
    'effect': {
      'Effect8Amount': '120',
      'Effect3Amount': '400',
      'Effect7Amount': '30',
      'Effect6Amount': '9',
      'Effect4Amount': '60',
      'Effect5Amount': '1500',
      'Effect2Amount': '90',
      'Effect1Amount': '6'
    },
    'maps': {
      '1': false,
      '10': false,
      '8': false,
      '14': false,
      '11': true,
      '12': true
    },
    'plaintext': 'Detects and disables nearby invisible wards and traps',
    'stats': {},
    'description': '<groupLimit>Limited to 1 Trinket.<\/groupLimit><br><br><active>Active:<\/active> Scans an area for 6 seconds, warning against hidden hos',
    'name': 'Sweeping Lens (Trinket)',
    'image': {
      'w': 48,
      'full': '3341.png',
      'sprite': 'item2.png',
      'group': 'item',
      'h': 48,
      'y': 0,
      'x': 336
    },
    'colloq': 'red;',
    'gold': {
      'total': 0,
      'purchasable': true,
      'sell': 0,
      'base': 0
    },
    'group': 'RelicBase'
  }, {
      'tags': [
        'Consumable',
        'Jungle',
        'Lane'
      ],
      'plaintext': 'Consume to restore Health over time',
      'stats': {},
      'image': {
        'w': 48,
        'full': '2003.png',
        'sprite': 'item0.png',
        'group': 'item',
        'h': 48,
        'y': 144,
        'x': 0
      },
      'stacks': 5,
      'id': 2003,
      'sanitizedDescription': 'Limited to 5 at one time. Limited to 1 type of Healing Potion. Click to Consume: Restores 150 Health over 15 seconds.',
      'consumed': true,
      'effect': {
        'Effect2Amount': '15',
        'Effect1Amount': '150'
      },
      'maps': {
        '1': false,
        '10': true,
        '8': true,
        '14': false,
        '11': true,
        '12': true
      },
      'description': '<groupLimit>Limited to 5 at one time. Limited to 1 type of Healing Potion.<\/groupLimit><br><br><consumable>Click to Consume:<\/consum',
      'name': 'Health Potion',
      'gold': {
        'total': 50,
        'purchasable': true,
        'sell': 20,
        'base': 50
      },
      'group': 'HealthPotion'
    }, {
      'tags': [
        'Consumable',
        'Jungle',
        'Lane'
      ],
      'plaintext': 'Consume to restore Health over time',
      'stats': {},
      'image': {
        'w': 48,
        'full': '2003.png',
        'sprite': 'item0.png',
        'group': 'item',
        'h': 48,
        'y': 144,
        'x': 0
      },
      'stacks': 5,
      'id': 2003,
      'sanitizedDescription': 'Limited to 5 at one time. Limited to 1 type of Healing Potion. Click to Consume: Restores 150 Health over 15 seconds.',
      'consumed': true,
      'effect': {
        'Effect2Amount': '15',
        'Effect1Amount': '150'
      },
      'maps': {
        '1': false,
        '10': true,
        '8': true,
        '14': false,
        '11': true,
        '12': true
      },
      'description': '<groupLimit>Limited to 5 at one time. Limited to 1 type of Healing Potion.<\/groupLimit><br><br><consumable>Click to Consume:<\/consum',
      'name': 'Health Potion',
      'gold': {
        'total': 50,
        'purchasable': true,
        'sell': 20,
        'base': 50
      },
      'group': 'HealthPotion'
    }, {
      'tags': [
        'Consumable',
        'Jungle',
        'Lane'
      ],
      'plaintext': 'Consume to restore Health over time',
      'stats': {},
      'image': {
        'w': 48,
        'full': '2003.png',
        'sprite': 'item0.png',
        'group': 'item',
        'h': 48,
        'y': 144,
        'x': 0
      },
      'stacks': 5,
      'id': 2003,
      'sanitizedDescription': 'Limited to 5 at one time. Limited to 1 type of Healing Potion. Click to Consume: Restores 150 Health over 15 seconds.',
      'consumed': true,
      'effect': {
        'Effect2Amount': '15',
        'Effect1Amount': '150'
      },
      'maps': {
        '1': false,
        '10': true,
        '8': true,
        '14': false,
        '11': true,
        '12': true
      },
      'description': '<groupLimit>Limited to 5 at one time. Limited to 1 type of Healing Potion.<\/groupLimit><br><br><consumable>Click to Consume:<\/consum',
      'name': 'Health Potion',
      'gold': {
        'total': 50,
        'purchasable': true,
        'sell': 20,
        'base': 50
      },
      'group': 'HealthPotion'
    }, {
      'tags': [
        'Consumable',
        'Jungle',
        'Lane'
      ],
      'plaintext': 'Consume to restore Health over time',
      'stats': {},
      'image': {
        'w': 48,
        'full': '2003.png',
        'sprite': 'item0.png',
        'group': 'item',
        'h': 48,
        'y': 144,
        'x': 0
      },
      'stacks': 5,
      'id': 2003,
      'sanitizedDescription': 'Limited to 5 at one time. Limited to 1 type of Healing Potion. Click to Consume: Restores 150 Health over 15 seconds.',
      'consumed': true,
      'effect': {
        'Effect2Amount': '15',
        'Effect1Amount': '150'
      },
      'maps': {
        '1': false,
        '10': true,
        '8': true,
        '14': false,
        '11': true,
        '12': true
      },
      'description': '<groupLimit>Limited to 5 at one time. Limited to 1 type of Healing Potion.<\/groupLimit><br><br><consumable>Click to Consume:<\/consum',
      'name': 'Health Potion',
      'gold': {
        'total': 50,
        'purchasable': true,
        'sell': 20,
        'base': 50
      },
      'group': 'HealthPotion'
    }, {
      'tags': [
        'Consumable',
        'Jungle',
        'Lane'
      ],
      'plaintext': 'Consume to restore Health over time',
      'stats': {},
      'image': {
        'w': 48,
        'full': '2003.png',
        'sprite': 'item0.png',
        'group': 'item',
        'h': 48,
        'y': 144,
        'x': 0
      },
      'stacks': 5,
      'id': 2003,
      'sanitizedDescription': 'Limited to 5 at one time. Limited to 1 type of Healing Potion. Click to Consume: Restores 150 Health over 15 seconds.',
      'consumed': true,
      'effect': {
        'Effect2Amount': '15',
        'Effect1Amount': '150'
      },
      'maps': {
        '1': false,
        '10': true,
        '8': true,
        '14': false,
        '11': true,
        '12': true
      },
      'description': '<groupLimit>Limited to 5 at one time. Limited to 1 type of Healing Potion.<\/groupLimit><br><br><consumable>Click to Consume:<\/consum',
      'name': 'Health Potion',
      'gold': {
        'total': 50,
        'purchasable': true,
        'sell': 20,
        'base': 50
      },
      'group': 'HealthPotion'
    }];

  constructor(params: RouteParams, private lolApi: LolApiService) {
    this.championKey = params.get('champion');
    this.getData();

    let summoner: string = params.get('summoner');
    let summonerId: any = params.get('summonerId');

    if (!summonerId || isNaN(summonerId)) {
      this.getSummonerMatchData(summoner);
    } else {
      this.getMatchData(parseInt(summonerId));
    }
  }

  getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampion(this.championKey)
      .subscribe(
      res => this.champion = res,
      error => { this.error = true; this.loading = false; },
      () => { this.loading = false; }
      );
  }

  getMatchData(summonerId: number) {
    this.lolApi.getMatchData(summonerId, this.championKey, this.config.gameTime, this.config.sampleSize)
      .subscribe(
      res => {
        this.config = new Config();
        this.config.xp = res.xp;
        this.config.g = res.g;
      },
      error => { this.error = true; }
      );
  }

  getSummonerMatchData(value: string) {
    this.lolApi.getSummonerMatchData(value, this.championKey, this.config.gameTime, this.config.sampleSize)
      .subscribe(
        res => {
          this.config = new Config();
          this.config.xp = res.xp;
          this.config.g = res.g;
        },
        error => { this.error = true; }
      );
  }
}
