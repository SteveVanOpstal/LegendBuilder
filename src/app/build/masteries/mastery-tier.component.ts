import {Component, Input, Inject, forwardRef, OnInit} from '@angular/core';
import {NgFor} from '@angular/common';

import {MasteryComponent} from './mastery.component';
import {MasteryCategoryComponent} from './mastery-category.component';

@Component({
  selector: 'mastery-tier',
  directives: [NgFor, MasteryComponent],
  template: `
    <mastery [data]="mastery" *ngFor="let mastery of data"></mastery>`
})

export class MasteryTierComponent implements OnInit {
  @Input() data: Object;
  @Input() index: number = 0;

  private masteryComponents: Array<MasteryComponent> = new Array<MasteryComponent>();

  constructor( @Inject(forwardRef(() => MasteryCategoryComponent)) private category: MasteryCategoryComponent) {
  }

  public ngOnInit() {
    this.category.addTierComponent(this);
  }

  public addMasteryComponent(mastery: MasteryComponent) {
    this.masteryComponents.push(mastery);
    if (this.index === 0) {
      mastery.enable();
    }
  }

  public enable() {
    this.masteryComponents.forEach((m) => m.enable());
  }
  public disable() {
    this.masteryComponents.forEach((m) => m.disable());
  }

  public lock() {
    this.masteryComponents.forEach((m) => m.lock());
  }
  public unlock() {
    this.masteryComponents.forEach((m) => m.unlock());
  }

  public setOtherRank(mastery: MasteryComponent, rank: number) {
    for (var index in this.masteryComponents) {
      var m = this.masteryComponents[index];
      if (mastery !== m && m.rank > 0) {
        m.setRank(rank);
        return;
      }
    }
  }
  public getRank(): number {
    var rank = 0;
    this.masteryComponents.forEach((m) => rank += m.getRank());
    return rank;
  }

  public rankAdded(mastery: MasteryComponent) {
    this.category.rankAdded(this, mastery);
  }

  public rankRemoved(mastery: MasteryComponent) {
    this.category.rankRemoved(this, mastery);
  }
}
