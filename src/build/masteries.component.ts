/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {LolApiService} from 'app/lolapi.service';

import {MasteryComponent} from 'app/mastery.component';
import {ErrorComponent} from 'app/error.component';

class MasteryList extends Array<MasteryComponent> {
  setEnabled(callback?: (mastery: MasteryComponent) => boolean) {
    this.forEach(function(mastery: MasteryComponent) {
      if(callback(mastery)) {
        mastery.setEnabled();
      }
    });
  }
  setEnabledTier(mastery: MasteryComponent, tier: number) {
    this.forEach(function(m: MasteryComponent) {
      if(tier == m.tier && mastery.category == m.category) {
        m.setEnabled();
      }
    });
  }
  setDisabled(callback?: (mastery: MasteryComponent) => boolean) {
    this.forEach(function(mastery: MasteryComponent) {
      if(callback(mastery)) {
        mastery.setDisabled();
      }
    });
  }
  setTierRank(mastery: MasteryComponent, rank: number) {
    this.forEach(function(m: MasteryComponent) {
      if(mastery !== m && mastery.tier == m.tier && mastery.category == m.category) {
        m.setRank(rank);
      }
    });
  }
  getTierRank(mastery: MasteryComponent): number {
    var rank = 0;
    this.forEach(function(m: MasteryComponent) {
      if(mastery.tier == m.tier && mastery.category == m.category) {
        rank += m.getRank();
      }
    });
    return rank;
  }
}

@Component({
  selector: 'masteries',
  providers: [LolApiService],
  directives: [NgFor, NgIf, MasteryComponent, ErrorComponent],
  template: `
    <div [class]="category.name + ' unselectable'" *ngFor="#category of data; #c = index">
      <div *ngFor="#lines of category.lines; #t = index">
        <mastery [data]="mastery" [category]="c" [tier]="t" *ngFor="#mastery of lines"></mastery>
      </div>
      <p class="total">{{category.name + ': 0'}}</p>
    </div>
    <error [loading]="loading" [ok]="ok" (retry)="getData()"></error>`
})

export class MasteriesComponent {  
  private data: Object;
  private loading: boolean = true;
  private ok: boolean = true;
  
  private masteries: MasteryList = new MasteryList();
  
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
      var lines = [];
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
        lines.push(item);
      }
      alteredMasteries.push({ name: categoryName, lines: lines });
    }
    
    return alteredMasteries;
  }
  
  public addMastery(mastery: MasteryComponent) {
    this.masteries.push(mastery);
    //this.changed(mastery);
  }
  
  private changed(mastery: MasteryComponent)
  {
    if (!mastery) {
      return;
    }  
    
    var tierRank = this.masteries.getTierRank(mastery);
    if (tierRank == 1) {
      mastery.setRank(mastery.getMaxRank())
      this.masteries.setEnabledTier(mastery, mastery.tier + 1);
    }
    else if (tierRank > mastery.getMaxRank()) {
      this.masteries.setTierRank(mastery, mastery.getMaxRank() - mastery.getRank());
    }
  }
}