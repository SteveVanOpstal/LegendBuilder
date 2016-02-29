/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Output, Pipe, EventEmitter, Inject} from 'angular2/core';
import {NgFor, NgIf, NgClass} from 'angular2/common';

import {LolApiService} from 'app/lolapi.service';

import {ErrorComponent} from 'app/error.component';
import {DDragonDirective} from 'app/ddragon.directive';

@Component({
  selector: 'mastery',
  providers: [LolApiService],
  template: `
    <!--<div class="center unselectable">-->
      <div [class]="category.name" *ngFor="#category of masteries">
        <div *ngFor="#lines of category.lines">
          <div class="mastery" *ngFor="#mastery of lines">
            <svg *ngIf="mastery" class="rank" width="30" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient cy="10%" fy="0%" id="radialGradient">
                  <stop offset="0%" [attr.stop-color]="color"/>
                  <stop offset="100%" stop-color="#000"/>
                </radialGradient>
                <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect x="0" y="0" width="30" height="16"/>
              <rect x="7" y="1" width="16" height="14" opacity="0.7" fill="url(#radialGradient)"/>
              <rect x="1" y="1" width="28" height="14" [attr.stroke]="color" fill="none" stroke-width="0.5" style="filter:url(#glow)"/>
              <text x="15" y="12" [attr.fill]="color" text-anchor="middle" font-size="12">{{'0/' + mastery.ranks}}</text>
            </svg>
            <img *ngIf="mastery" [attr.alt]="mastery.name" width="45px" [ddragon]="'mastery/' + mastery.image.full">
            <div *ngIf="mastery">
              <h2>{{mastery.name}}</h2>
              <p>{{mastery.description[0]}}</p>
            </div>
          </div>
        </div>
        <p class="total">{{category.name + ': 0'}}</p>
      </div>
    <!--</div>-->`,
  directives: [NgFor, NgIf, NgClass, ErrorComponent, DDragonDirective]
})

export class MasteryComponent {  
  private masteries : Object;
  private loading: boolean = true;
  private ok: boolean = true;
  
  private color: string = "yellow";
  
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
      for (var masteryTreeItemName in category[0]) {
        var masteryTreeItem = category[0][masteryTreeItemName];
        var item = [];
        for (var masteryName in masteryTreeItem) {
          var mastery = masteryTreeItem[masteryName];
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