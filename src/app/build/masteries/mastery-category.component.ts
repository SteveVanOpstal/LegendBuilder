import {Component, Input, Output, EventEmitter, ViewChildren, QueryList} from '@angular/core';
import {NgFor} from '@angular/common';

import {MasteryComponent} from './mastery.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteriesComponent} from './masteries.component';

type EventEmitterRank = EventEmitter<{ tier: MasteryTierComponent, mastery: MasteryComponent }>;

@Component({
  selector: 'mastery-category',
  directives: [NgFor, MasteryTierComponent],
  template: `
    <mastery-tier [data]="tier" [index]="i" *ngFor="let tier of data.tiers; let i = index" (rankAdded)="rankAdd($event)" (rankRemoved)="rankRemove($event)"></mastery-tier>
    <p class="total">{{data.name + ': ' + totalRank}}</p>`
})

export class MasteryCategoryComponent {
  @Input() data: Object;

  @Output() rankAdded: EventEmitterRank = new EventEmitterRank();
  @Output() rankRemoved: EventEmitterRank = new EventEmitterRank();

  @ViewChildren(MasteryTierComponent) children: QueryList<MasteryTierComponent>;

  private totalRank: number = 0;

  constructor() {
  }

  public enable() {
    this.children.forEach((t: MasteryTierComponent) => {
      if (t.index === 0) {
        t.enable();
      } else if (this.children[t.index - 1].getRank() !== 0) {
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

  public rankAdd(tier: MasteryTierComponent, mastery: MasteryComponent) {
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
    this.rankAdded.emit({ tier: tier, mastery: mastery });
    this.totalRank = this.getRank();
  }

  public rankRemove(tier: MasteryTierComponent, mastery: MasteryComponent) {
    if (!tier || !mastery) {
      return;
    }
    if (tier.getRank() < mastery.getMaxRank()) {
      this.forTier(tier.index + 1, (t) => t.disable());
      this.forTier(tier.index - 1, (t) => t.unlock());
    }
    this.rankRemoved.emit({ tier: tier, mastery: mastery });
    this.totalRank = this.getRank();
  }

  public getRank(): number {
    let rank = 0;
    this.children.forEach((t) => rank += t.getRank());
    return rank;
  }

  private forTier(index: number, callback: (masteryTierComponent: MasteryTierComponent) => void) {
    if (!this.children[index]) {
      return;
    }
    callback(this.children[index]);
  }
}
