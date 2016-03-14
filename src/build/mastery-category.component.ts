/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Input, Inject, forwardRef, OnInit} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {MasteryComponent} from 'app/mastery.component';
import {MasteryTierComponent} from 'app/mastery-tier.component';
import {MasteriesComponent} from 'app/masteries.component';

@Component({
  selector: 'mastery-category',
  directives: [NgFor, MasteryTierComponent],
  template: `
    <mastery-tier [data]="tier" [index]="i" *ngFor="#tier of data.tiers; #i = index"></mastery-tier>
    <p class="total">{{data.name + ': ' + totalRank}}</p>`
})

export class MasteryCategoryComponent implements OnInit {
  @Input() data: Object;

  private totalRank: number = 0;
  private tiers: Array<MasteryTierComponent> = new Array<MasteryTierComponent>();

  constructor( @Inject(forwardRef(() => MasteriesComponent)) private masteries: MasteriesComponent) {
  }

  public ngOnInit() {
    this.masteries.addCategory(this);
  }

  public addTier(tier: MasteryTierComponent) {
    this.tiers[tier.index] = tier;
  }

  private forTier(index: number, callback: (MasteryTierComponent) => void) {
    if (!this.tiers[index]) {
      return;
    }
    callback(this.tiers[index]);
  }
  private forEachTier(callback: (MasteryTierComponent) => void) {
    this.tiers.forEach(function(tier: MasteryTierComponent) {
      callback(tier);
    });
  }

  public enable() {
    this.forEachTier((t) => {
      if (t.index == 0) {
        t.enable();
      }
      else if (this.tiers[t.index - 1].getRank() != 0) {
        t.enable();
      }
    });
  }
  public disable() {
    this.forEachTier((t) => {
      if (t.getRank() == 0) {
        t.disable();
      }
    });
  }

  private getRank(): number {
    var rank = 0;
    this.forEachTier((t) => rank += t.getRank());
    return rank;
  }

  private getMasteriesTotalRankDeviation() {
    var deviation = this.masteries.getRank() - 30;
    return deviation > 0 ? deviation : 0;
  }

  private addRank(tier: MasteryTierComponent, mastery: MasteryComponent) {
    if (!tier) {
      return;
    }
    if (tier.getRank() == mastery.getMaxRank()) {
      this.forTier(tier.index + 1, (t) => t.enable());
      this.forTier(tier.index - 1, (t) => t.lock());
    }
    if (tier.getRank() > mastery.getRank()) {
      tier.setRank(mastery, mastery.getMaxRank() - mastery.getRank());
    }
    var deviation = this.getMasteriesTotalRankDeviation();
    if (deviation) {
      if (tier.getRank() > mastery.getRank()) {
        tier.setRank(mastery, tier.getRank() - deviation - mastery.getRank());
      }
      else {
        mastery.setRank(tier.getRank() - deviation);
      }
    }
    this.masteries.addRank();
    this.totalRank = this.getRank();
  }

  private removeRank(tier: MasteryTierComponent, mastery: MasteryComponent) {
    if (!tier) {
      return;
    }
    if (tier.getRank() < mastery.getMaxRank()) {
      this.forTier(tier.index + 1, (t) => t.disable());
      this.forTier(tier.index - 1, (t) => t.unlock());
    }
    this.masteries.removeRank();
    this.totalRank = this.getRank();
  }
}