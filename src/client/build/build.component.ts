import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {settings} from '../../../config/settings';
import {DataService} from '../services/data.service';
import {LolApiService} from '../services/lolapi.service';
import {StatsService} from '../services/stats.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  styles: [require('./build.css').toString()],
  template: `
    <div class="title">
      <img *ngIf="champion" [lbDDragon]="'champion/' + champion?.image?.full">
      <h2>{{champion?.name}}</h2>
    </div>
    <lb-graph></lb-graph>
    <lb-abilities></lb-abilities>
    <lb-masteries></lb-masteries>
    <lb-items #items></lb-items>
    <lb-shop (itemPicked)="items.addItem($event)"></lb-shop>
    <lb-loading [loading]="loading"></lb-loading>
    <lb-retry [error]="error" (retry)="getData()"></lb-retry>`
})

export class BuildComponent implements OnInit {
  private championKey: string;
  private champion: any;
  private loading: boolean = true;
  private error: boolean = false;

  constructor(
      private route: ActivatedRoute, private stats: StatsService, private data: DataService,
      private lolApi: LolApiService) {}

  ngOnInit() {
    this.championKey = this.route.snapshot.params['champion'];
    this.getData();

    let summoner = this.route.snapshot.params['summoner'];
    this.getMatchData(summoner);
  }

  getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getChampion(this.championKey)
        .subscribe(
            res => {
              this.champion = res;
              this.data.champion.notify(res);
            },
            error => {
              this.error = true;
              this.loading = false;
            },
            () => {
              this.loading = false;
            });
  }

  getMatchData(value: string) {
    this.lolApi
        .getMatchData(value, this.championKey, settings.gameTime, settings.matchServer.sampleSize)
        .subscribe(
            res => {
              this.data.samples.notify(res);
            },
            error => {
              this.error = true;
            });
  }
}
