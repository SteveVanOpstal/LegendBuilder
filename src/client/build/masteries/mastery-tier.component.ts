import {NgFor} from '@angular/common';
import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';

import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryComponent} from './mastery.component';

type EventData = {
  tier: MasteryTierComponent,
  mastery: MasteryComponent
};

@Component({
  selector: 'mastery-tier',
  directives: [NgFor, MasteryComponent],
  template: `
    <mastery [data]="mastery" [enabled]="index == 0" *ngFor="let mastery of data" (rankAdded)="rankAdd($event)" (rankRemoved)="rankRemove($event)"></mastery>`
})

export class MasteryTierComponent {
  @Input() data: Object;
  @Input() index: number = 0;

  @Output() rankAdded: EventEmitter<EventData> = new EventEmitter<EventData>();
  @Output()
  rankRemoved: EventEmitter<EventData> = new EventEmitter<EventData>();

  @ViewChildren(MasteryComponent) children: QueryList<MasteryComponent>;

  constructor() {}

  public enable() {
    this.children.forEach((m) => m.enable());
  }
  public disable() {
    this.children.forEach((m) => m.disable());
  }

  public lock() {
    this.children.forEach((m) => m.lock());
  }
  public unlock() {
    this.children.forEach((m) => m.unlock());
  }

  public setOtherRank(mastery: MasteryComponent, rank: number) {
    for (let m of this.children.toArray()) {
      if (mastery !== m && m.getRank() > 0) {
        m.setRank(rank);
        return;
      }
    }
  }

  public getRank(): number {
    let rank = 0;
    this.children.forEach((m) => rank += m.getRank());
    return rank;
  }

  public rankAdd(mastery: MasteryComponent) {
    if (this.getRank() === 0) {
      mastery.setRank(mastery.getMaxRank());
    } else if (mastery.getRank() < mastery.getMaxRank()) {
      mastery.addRank();
    }
    this.rankAdded.emit({tier: this, mastery: mastery});
  }

  public rankRemove(mastery: MasteryComponent) {
    this.rankRemoved.emit({tier: this, mastery: mastery});
  }
}
