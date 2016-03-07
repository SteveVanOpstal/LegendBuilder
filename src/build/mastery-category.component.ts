/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Input} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {MasteryComponent} from 'app/mastery.component';
import {MasteryTierComponent} from 'app/mastery-tier.component';

@Component({
  selector: 'mastery-category',
  directives: [NgFor, MasteryTierComponent],
  template: `
    <mastery-tier [data]="tier" [index]="i" *ngFor="#tier of data.tiers; #i = index"></mastery-tier>
    <p class="total">{{data.name + ': ' + totalRank}}</p>`
})

export class MasteryCategoryComponent {  
  @Input() data: Object;
  
  private totalRank: number = 0;
  private tiers: Array<MasteryTierComponent> = new Array<MasteryTierComponent>();
  
  constructor() {
  }
  
  public addTier(tier: MasteryTierComponent) {
    this.tiers[tier.index] = tier;
  }
  
  private getRank(): number {
    var rank = 0;
    this.tiers.forEach(function(tier: MasteryTierComponent) {
      rank += tier.getRank();
    });
    return rank;
  }
  
  private alterTier(index: number, callback: (MasteryTierComponent) => void) {
    if (!this.tiers[index]) {
      return;
    }
    this.tiers[index].enable();
  }
  
  private addRank(tier: MasteryTierComponent, mastery: MasteryComponent)
  {
    if (!tier) {
      return;
    }
    if (tier.getRank() == 1) {
      mastery.setRank(mastery.getMaxRank())
      this.alterTier(tier.index + 1, (t) => t.enable());
      this.alterTier(tier.index - 1, (t) => t.lock());
    }
    this.changed(tier, mastery);
  }
  
  private removeRank(tier: MasteryTierComponent, mastery: MasteryComponent)
  {
    if (!tier) {
      return;
    }
    if (tier.getRank() == 0) {
      this.alterTier(tier.index + 1, (t) => t.disable());
      this.alterTier(tier.index - 1, (t) => t.unlock());
    }
    this.changed(tier, mastery);
  }
  
  private changed(tier: MasteryTierComponent, mastery: MasteryComponent)
  {
    if (tier.getRank() > mastery.getMaxRank()) {
      tier.setRank(mastery, mastery.getMaxRank() - mastery.getRank());
    }
    this.totalRank = this.getRank();
  }
}