import {Component, QueryList, ViewChildren} from '@angular/core';

import {ReactiveComponent} from '../../../shared/reactive.component';
import {BuildSandbox} from '../build.sandbox';

import {MasteryCategoryComponent} from './mastery-category/mastery-category.component';
import {MasteryTierComponent} from './mastery-tier/mastery-tier.component';
import {MasteryComponent} from './mastery/mastery.component';

@Component({
  selector: 'lb-masteries',
  styleUrls: ['./masteries.component.scss'],
  template: `
    <lb-loading [observable]="sb.masteries$">
      <lb-mastery-category [class]="category.name + ' noselect'"
                        [data]="category"
                        *ngFor="let category of sb.masteries$"
                        (rankAdded)="rankAdd($event)"
                        (rankRemoved)="rankRemove()">
      </lb-mastery-category>
    </lb-loading>`
})

export class MasteriesComponent extends ReactiveComponent {
  @ViewChildren(MasteryCategoryComponent)
  children: QueryList<MasteryCategoryComponent>;

  constructor(public sb: BuildSandbox) {
    super();
  }

  enable() {
    this.children.forEach((c) => c.enable());
  }
  disable() {
    this.children.forEach((c) => c.disable());
  }

  getRank(): number {
    let rank = 0;
    this.children.forEach((c) => rank += c.getRank());
    return rank;
  }

  rankAdd(event: {tier: MasteryTierComponent, mastery: MasteryComponent}) {
    const tier = event.tier;
    const mastery = event.mastery;
    const deviation = this.getTotalRankExceeded();
    if (deviation) {
      if (tier.getRank() > mastery.getRank()) {
        tier.setOtherRank(mastery, tier.getRank() - deviation - mastery.getRank());
      } else {
        mastery.setRank(tier.getRank() - deviation);
      }
    }

    if (this.getRank() >= 30) {
      this.disable();
    }
  }

  rankRemove() {
    if (this.getRank() === 29) {
      this.enable();
    }
  }

  private getTotalRankExceeded() {
    const deviation = this.getRank() - 30;
    return deviation > 0 ? deviation : 0;
  }
}
