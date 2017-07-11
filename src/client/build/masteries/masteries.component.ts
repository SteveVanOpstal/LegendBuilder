import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import {LolApiService} from '../../services';

import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

@Component({
  selector: 'lb-masteries',
  template: `
    <lb-loading [observable]="lolApi.getMasteries()">
      <lb-mastery-category [class]="category.name + ' noselect'"
                        [data]="category"
                        *ngFor="let category of data"
                        (rankAdded)="rankAdd($event)"
                        (rankRemoved)="rankRemove()">
      </lb-mastery-category>
    </lb-loading>`
})

export class MasteriesComponent implements OnInit {
  @ViewChildren(MasteryCategoryComponent)
  children: QueryList<MasteryCategoryComponent>;
  data: Object;

  constructor(public lolApi: LolApiService) {}

  public ngOnInit() {
    this.lolApi.getMasteries().subscribe(res => {
      this.data = this.transformData(res);
    });
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

  public rankRemove() {
    if (this.getRank() === 29) {
      this.enable();
    }
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
