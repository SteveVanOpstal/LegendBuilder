import {Component, ViewChildren, QueryList} from '@angular/core';
import {NgFor} from '@angular/common';

import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

import {LoadingComponent} from '../../misc/loading.component';
import {ErrorComponent} from '../../misc/error.component';

import {LolApiService} from '../../misc/lolapi.service';

@Component({
  selector: 'masteries',
  providers: [LolApiService],
  directives: [NgFor, MasteryCategoryComponent, LoadingComponent, ErrorComponent],
  template: `
    <mastery-category [class]="category.name + ' noselect'" [data]="category" *ngFor="let category of data" (rankAdded)="rankAdd($event)" (rankRemoved)="rankRemove($event)"></mastery-category>
    <loading [loading]="loading"></loading>
    <error [error]="error" (retry)="getData()"></error>`
})

export class MasteriesComponent {
  @ViewChildren(MasteryCategoryComponent) children: QueryList<MasteryCategoryComponent>;

  private data: Object;
  private loading: boolean = true;
  private error: boolean = false;

  constructor(private lolApi: LolApiService) {
    this.getData();
  }

  public enable() {
    this.children.forEach((c) => c.enable());
  }
  public disable() {
    this.children.forEach((c) => c.disable());
  }

  public getRank(): number {
    let rank = 0;
    this.children.forEach((c) => rank += c.getRank());
    return rank;
  }

  public rankAdd(tier: MasteryTierComponent, mastery: MasteryComponent) {
    let deviation = this.getTotalRankDeviation();
    if (deviation) {
      if (tier.getRank() > mastery.getRank()) {
        tier.setOtherRank(mastery, tier.getRank() - deviation - mastery.getRank());
      } else {
        mastery.setRank(tier.getRank() - deviation);
      }
    }

    if (this.getRank() >= 30) {
      this.disable();
    }
  }

  public rankRemove() {
    if (this.getRank() === 29) {
      this.enable();
    }
  }

  private getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getMasteries()
      .subscribe(
      res => this.data = this.alterData(res),
      error => { this.error = true; this.loading = false; },
      () => this.loading = false
      );
  }

  private alterData(newMasteries: any) {
    let alteredMasteries = [];

    for (let categoryName in newMasteries.tree) {
      let category = newMasteries.tree[categoryName];
      let tiers = [];
      for (let masteryTreeItemName in category) {
        let masteryTreeItem = category[masteryTreeItemName];
        let item = [];
        for (let masteryName in masteryTreeItem.masteryTreeItems) {
          let mastery = masteryTreeItem.masteryTreeItems[masteryName];
          if (mastery !== undefined) {
            item.push(newMasteries.data[mastery.masteryId]);
          } else {
            item.push(undefined);
          }
        }
        tiers.push(item);
      }
      alteredMasteries.push({ name: categoryName, tiers: tiers });
    }

    return alteredMasteries;
  }

  private getTotalRankDeviation() {
    let deviation = this.getRank() - 30;
    return deviation > 0 ? deviation : 0;
  }
}
