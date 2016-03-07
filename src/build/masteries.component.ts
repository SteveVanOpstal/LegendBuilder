/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {LolApiService} from 'app/lolapi.service';

import {MasteryCategoryComponent} from 'app/mastery-category.component';
import {ErrorComponent} from 'app/error.component';

@Component({
  selector: 'masteries',
  providers: [LolApiService],
  directives: [NgFor, MasteryCategoryComponent, ErrorComponent],
  template: `
    <mastery-category [class]="category.name + ' unselectable'" [data]="category" *ngFor="#category of data"></mastery-category>
    <error [loading]="loading" [ok]="ok" (retry)="getData()"></error>`
})

export class MasteriesComponent {  
  private data: Object;
  private loading: boolean = true;
  private ok: boolean = true;
  
  constructor(private lolApi: LolApiService) {
    this.getData();
  }
  
  private getData() {
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getMasteries()
      .subscribe(
        res => this.data = this.alterData(res.json()),
        error => { this.ok = false; this.loading = false; },
        () => this.loading = false
      );
  }
  
  private alterData(newMasteries: Object)
  {
    var alteredMasteries = [];
    
    for (var categoryName in newMasteries['tree']) {
      var category = newMasteries['tree'][categoryName];
      var tiers = [];
      for (var masteryTreeItemName in category) {
        var masteryTreeItem = category[masteryTreeItemName];
        var item = [];
        for (var masteryName in masteryTreeItem["masteryTreeItems"]) {
          var mastery = masteryTreeItem["masteryTreeItems"][masteryName];
          if (mastery !== null) {
            item.push(newMasteries['data'][mastery.masteryId]);
          }
          else {
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