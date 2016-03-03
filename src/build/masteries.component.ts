/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {LolApiService} from 'app/lolapi.service';

import {MasteryComponent} from 'app/mastery.component';
import {HelpComponent} from 'app/help.component';
import {ErrorComponent} from 'app/error.component';

class MasteryList extends Array<MasteryComponent> {
  setEnabled(callback?: (mastery: MasteryComponent) => boolean) {
    this.forEach(function(mastery: MasteryComponent) {
      if(callback(mastery)) {
        mastery.setEnabled();
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
}

@Component({
  selector: 'masteries',
  providers: [LolApiService],
  directives: [NgFor, NgIf, MasteryComponent, HelpComponent, ErrorComponent],
  template: `
    <div [class]="category.name + ' unselectable'" *ngFor="#category of data">
      <div *ngFor="#lines of category.lines; #i = index">
        <mastery [data]="mastery" [tier]="i" *ngFor="#mastery of lines"></mastery>
      </div>
      <p class="total">{{category.name + ': 0'}}</p>
    </div>
    <help *ngIf="ok && !loading" [content]="['Left click to add ranks','Right click to remove ranks']"></help>
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
        res => this.data = this.alterData(res),
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
    //this.changed();
  }
  
  private changed()
  {
    this.masteries.setEnabled(function(mastery: MasteryComponent) {
      return mastery.hasTier([0]);
    });
  }
}