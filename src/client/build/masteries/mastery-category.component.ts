import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';

import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

type EventData = {
  tier: MasteryTierComponent,
  mastery: MasteryComponent
};

@Component({
  selector: 'mastery-category',
  template: `
    <mastery-tier [data]="tier" [index]="i" *ngFor="let tier of data.tiers; let i = index" (rankAdded)="rankAdd($event)" (rankRemoved)="rankRemove($event)"></mastery-tier>
    <p class="total">{{data.name + ': ' + totalRank}}</p>`
})

export class MasteryCategoryComponent {
  @Input() data: Object;

  @Output() rankAdded: EventEmitter<EventData> = new EventEmitter<EventData>();
  @Output()
  rankRemoved: EventEmitter<EventData> = new EventEmitter<EventData>();

  @ViewChildren(MasteryTierComponent) children: QueryList<MasteryTierComponent>;

  private totalRank: number = 0;

  constructor() {}

  public enable() {
    this.children.forEach((t: MasteryTierComponent) => {
      if (t.index === 0) {
        t.enable();
      } else if (this.children.toArray()[t.index - 1].getRank() !== 0) {
        t.enable();
      }
    });
  }
  public disable() {
    this.children.forEach((t: MasteryTierComponent) => {
      if (t.getRank() === 0) {
        t.disable();
      }
    });
  }

  public rankAdd(event: {tier: MasteryTierComponent, mastery: MasteryComponent}) {
    let tier = event.tier;
    let mastery = event.mastery;
    if (!tier || !mastery) {
      return;
    }
    if (tier.getRank() === mastery.getMaxRank()) {
      this.forTier(tier.index + 1, (t) => t.enable());
      this.forTier(tier.index - 1, (t) => t.lock());
    }
    if (tier.getRank() > mastery.getRank()) {
      tier.setOtherRank(mastery, mastery.getMaxRank() - mastery.getRank());
    }
    this.rankAdded.emit({tier: tier, mastery: mastery});
    this.totalRank = this.getRank();
  }

  public rankRemove(event: {tier: MasteryTierComponent, mastery: MasteryComponent}) {
    let tier = event.tier;
    let mastery = event.mastery;
    if (!tier || !mastery) {
      return;
    }
    if (tier.getRank() < mastery.getMaxRank()) {
      this.forTier(tier.index + 1, (t) => t.disable());
      this.forTier(tier.index - 1, (t) => t.unlock());
    }
    this.rankRemoved.emit({tier: tier, mastery: mastery});
    this.totalRank = this.getRank();
  }

  public getRank(): number {
    let rank = 0;
    this.children.forEach((t) => rank += t.getRank());
    return rank;
  }

  private forTier(index: number, callback: (masteryTierComponent: MasteryTierComponent) => void) {
    let tier = this.children.toArray()[index];
    if (!tier) {
      return;
    }
    callback(tier);
  }
}
