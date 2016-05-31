import {Component, Input, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import {NgFor} from '@angular/common';

import {MasteryComponent} from './mastery.component';
import {MasteryCategoryComponent} from './mastery-category.component';

type EventEmitterRank = EventEmitter<{ tier: MasteryTierComponent, mastery: MasteryComponent }>;

@Component({
  selector: 'mastery-tier',
  directives: [NgFor, MasteryComponent],
  template: `
    <mastery [data]="mastery" *ngFor="let mastery of data" (rankAdded)="rankAdd($event)" (rankRemoved)="rankRemove($event)"></mastery>`
})

export class MasteryTierComponent implements AfterViewInit {
  @Input() data: Object;
  @Input() index: number = 0;

  @Output() rankAdded: EventEmitterRank = new EventEmitterRank();
  @Output() rankRemoved: EventEmitterRank = new EventEmitterRank();

  @ViewChildren(MasteryComponent) children: QueryList<MasteryComponent>;

  constructor() {
  }

  public ngAfterViewInit() {
    if (this.index === 0) {
      this.enable();
    }
  }

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
    for (let index in this.children) {
      let m = this.children[index];
      if (mastery !== m && m.rank > 0) {
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
      mastery.rank = mastery.getMaxRank();
    } else if (mastery.rank < mastery.getMaxRank()) {
      mastery.rank++;
    }
    this.rankAdded.emit({ tier: this, mastery: mastery });
  }

  public rankRemove(mastery: MasteryComponent) {
    this.rankRemoved.emit({ tier: this, mastery: mastery });
  }
}
