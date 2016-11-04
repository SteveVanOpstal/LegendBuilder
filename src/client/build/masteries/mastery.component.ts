import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import {Colors} from '../../assets/icon-rank.component';

@Component({
  selector: 'mastery',
  template: `
    <div *ngIf="data"
         [ngClass]="{enabled: enabled, active: active}"
         (click)="clicked()"
         (contextmenu)="rightClicked()"
         (dragend)="dragEnd()">
      <icon-rank [rank]="rank" [maxRank]="data.ranks" [color]="color"></icon-rank>
      <img [attr.alt]="data.name" [ddragon]="'mastery/' + data.image.full">
      <div class="description">
        <h2>{{data.name}}</h2>
        <p>{{data.description[0]}}</p>
      </div>
    </div>`
})

export class MasteryComponent implements OnChanges {
  @Input() data: any;
  @Input() enabled: boolean;

  @Output() rankAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() rankRemoved: EventEmitter<any> = new EventEmitter<any>();

  private rank: number = 0;
  private color: string = Colors.gray;

  private active: boolean = false;
  private locked: boolean = false;

  constructor() {}

  ngOnChanges() {
    this.changed();
  }

  enable() {
    if (this.enabled) {
      return;
    }
    if (!this.data) {
      this.disable();
      return;
    }
    this.enabled = true;
    this.changed();
  }

  disable() {
    if (!this.enabled || this.rank > 0) {
      return;
    }
    this.enabled = false;
    this.changed();
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  getRank() {
    return this.rank;
  }

  addRank() {
    this.rank++;
    this.changed();
  }

  setRank(rank: number) {
    if (!this.enabled) {
      return;
    }
    this.rank = rank;
    this.changed();
  }

  getMaxRank() {
    if (!this.data || !this.data.ranks) {
      return 0;
    }
    return this.data.ranks;
  }

  rankAdd() {
    if (!this.enabled) {
      return;
    }
    this.rankAdded.emit(this);
    this.changed();
  }

  getActive() {
    return this.active;
  }

  getColor() {
    return this.color;
  }

  rankRemove() {
    if (!this.enabled || this.locked) {
      return;
    }
    if (this.rank > 0) {
      this.rank--;
    }
    this.rankRemoved.emit(this);
    this.changed();
  }

  clicked() {
    this.rankAdd();
  }

  dragEnd() {
    this.rankAdd();
  }

  rightClicked() {
    this.rankRemove();
    return false;  // stop context menu from appearing
  }

  private changed() {
    if (this.enabled) {
      this.active = this.rank !== 0;
      this.color = this.active ? Colors.yellow : Colors.blue;
    } else {
      this.active = false;
      this.color = Colors.gray;
    }
  }
}
