/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {LolApiService} from 'app/lolapi.service';

import {MasteryComponent} from 'app/mastery.component';
import {ErrorComponent} from 'app/error.component';

@Component({
  selector: 'masteries',
  providers: [LolApiService],
  directives: [NgFor, MasteryComponent, ErrorComponent], //todo
  template: `
    <!--<div class="center unselectable">-->
      <div [class]="category.name" *ngFor="#category of masteries">
        <div *ngFor="#lines of category.lines">
          <mastery [data]="mastery" *ngFor="#mastery of lines"></mastery>
        </div>
        <p class="total">{{category.name + ': 0'}}</p>
      </div>
    <!--</div>-->`
})

export class MasteriesComponent {  
  private masteries : Object;
  private loading: boolean = true;
  private ok: boolean = true;
  
  constructor(private lolApi: LolApiService) {
    this.getData();
  }
  
  getData() {
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getMasteries()
      .subscribe(
      res => {
        this.masteries = this.alterData(res.json());
        },
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
}