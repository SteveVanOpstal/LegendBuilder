import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import {LolApiService} from '../../services/lolapi.service';

import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

@Component({
  selector: 'masteries',
  template: `
    <mastery-category [class]="category.name + ' noselect'" [data]="category" *ngFor="let category of data" (rankAdded)="rankAdd($event)" (rankRemoved)="rankRemove($event)"></mastery-category>
    <loading [loading]="loading"></loading>
    <retry [error]="error" (retry)="getData()"></retry>`
})

export class MasteriesComponent implements OnInit {
  @ViewChildren(MasteryCategoryComponent)
  children: QueryList<MasteryCategoryComponent>;
  data: Object;

  private loading: boolean = true;
  private error: boolean = false;

  constructor(private lolApi: LolApiService) {}

  public ngOnInit() {
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

  public rankAdd(event: {tier: MasteryTierComponent, mastery: MasteryComponent}) {
    let tier = event.tier;
    let mastery = event.mastery;
    let deviation = this.getTotalRankExceeded();
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

  public rankRemove(event: {tier: MasteryTierComponent, mastery: MasteryComponent}) {
    if (this.getRank() === 29) {
      this.enable();
    }
  }

  private getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getMasteries().subscribe(
        res => {
          this.data = this.transformData(res);
        },
        error => {
          this.error = true;
          this.loading = false;
        },
        () => this.loading = false);
  }

  private transformData(newMasteries: any) {
    let transformedMasteries: Array<any> = [];

    for (let categoryName in newMasteries.tree) {
      let category = newMasteries.tree[categoryName];
      let tiers: Array<any> = [];
      for (let masteryTreeItemName in category) {
        let masteryTreeItem = category[masteryTreeItemName];
        let item: Array<any> = [];
        for (let masteryName in masteryTreeItem.masteryTreeItems) {
          let mastery = masteryTreeItem.masteryTreeItems[masteryName];
          if (mastery !== null) {
            item.push(newMasteries.data[mastery.masteryId]);
          } else {
            item.push(null);
          }
        }
        tiers.push(item);
      }
      transformedMasteries.push({name: categoryName, tiers: tiers});
    }

    return transformedMasteries;
  }

  private getTotalRankExceeded() {
    let deviation = this.getRank() - 30;
    return deviation > 0 ? deviation : 0;
  }
}
