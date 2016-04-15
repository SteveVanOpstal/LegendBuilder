import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {MasteryCategoryComponent} from './mastery-category.component';

import {LoadingComponent} from '../../misc/loading.component';
import {ErrorComponent} from '../../misc/error.component';

import {LolApiService} from '../../misc/lolapi.service';

@Component({
  selector: 'masteries',
  providers: [LolApiService],
  directives: [NgFor, MasteryCategoryComponent, LoadingComponent, ErrorComponent],
  template: `
    <mastery-category [class]="category.name + ' noselect'" [data]="category" *ngFor="#category of data"></mastery-category>
    <loading [loading]="loading"></loading>
    <error [error]="error" (retry)="getData()"></error>`
})

export class MasteriesComponent {
  private data: Object;
  private loading: boolean = true;
  private error: boolean = false;

  private categoryComponents: Array<MasteryCategoryComponent> = new Array<MasteryCategoryComponent>();

  constructor(private lolApi: LolApiService) {
    this.getData();
  }

  public addCategoryComponent(category: MasteryCategoryComponent) {
    this.categoryComponents.push(category);
  }

  public enable() {
    this.categoryComponents.forEach((c) => c.enable());
  }
  public disable() {
    this.categoryComponents.forEach((c) => c.disable());
  }

  public getRank(): number {
    var rank = 0;
    this.categoryComponents.forEach((c) => rank += c.getRank());
    return rank;
  }

  public rankAdded() {
    if (this.getRank() >= 30) {
      this.disable();
    }
  }

  public rankRemoved() {
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

  private alterData(newMasteries: Object) {
    var alteredMasteries = [];

    for (var categoryName in newMasteries['tree']) {
      var category = newMasteries['tree'][categoryName];
      var tiers = [];
      for (var masteryTreeItemName in category) {
        var masteryTreeItem = category[masteryTreeItemName];
        var item = [];
        for (var masteryName in masteryTreeItem['masteryTreeItems']) {
          var mastery = masteryTreeItem['masteryTreeItems'][masteryName];
          if (mastery !== null) {
            item.push(newMasteries['data'][mastery.masteryId]);
          } else {
            item.push(null);
          }
        }
        tiers.push(item);
      }
      alteredMasteries.push({ name: categoryName, tiers: tiers });
    }

    return alteredMasteries;
  }
}
