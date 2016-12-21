import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {LolApiService} from '../services/lolapi.service';
import {ItemsComponent} from './items/items.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  styles: [require('./build.css').toString()],
  template: `
    <div class="title">
      <img *ngIf="champion"
           [attr.alt]="champion?.name"
           [lbDDragon]="'champion/' + champion?.image?.full">
      <h2>{{champion?.name}}</h2>
    </div>
    <lb-graph></lb-graph>
    <lb-abilities></lb-abilities>
    <lb-masteries></lb-masteries>
    <lb-items #items></lb-items>
    <lb-shop (itemPicked)="items.addItem($event)"></lb-shop>
    <lb-loading [loading]="loading"></lb-loading>
    <lb-retry [error]="error" (retry)="ngOnInit()"></lb-retry>`
})

export class BuildComponent implements OnInit {
  items: ItemsComponent;
  champion: any;
  loading: boolean = true;
  error: boolean = false;

  constructor(private lolApi: LolApiService) {}

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.lolApi.getCurrentChampion().subscribe(
        (champion) => {
          this.champion = champion;
          this.loading = false;
        },
        () => {
          this.error = true;
          this.loading = false;
        });
  }
}
