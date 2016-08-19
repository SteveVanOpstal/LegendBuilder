import {NgClass, NgIf} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import {Colors, IconRankComponent} from '../../assets/icon-rank.component';
import {DDragonDirective} from '../../misc/ddragon.directive';

@Component({
  selector: 'mastery',
  directives: [NgIf, NgClass, DDragonDirective, IconRankComponent],
  template: `
    <div *ngIf="data" [ngClass]="{enabled: enabled, active: active}" (click)="clicked()" (contextmenu)="rightClicked()" (dragend)="dragEnd()">
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

  public ngOnChanges() {
    this.changed();
  }

  public enable() {
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

  public disable() {
    if (!this.enabled || this.rank > 0) {
      return;
    }
    this.enabled = false;
    this.changed();
  }

  public lock() {
    this.locked = true;
  }

  public unlock() {
    this.locked = false;
  }

  public getRank() {
    return this.rank;
  }

  public addRank() {
    this.rank++;
    this.changed();
  }

  public setRank(rank: number) {
    if (!this.enabled) {
      return;
    }
    this.rank = rank;
    this.changed();
  }

  public getMaxRank() {
    if (!this.data || !this.data.ranks) {
      return 0;
    }
    return this.data.ranks;
  }

  public rankAdd() {
    if (!this.enabled) {
      return;
    }
    this.rankAdded.emit(this);
    this.changed();
  }

  public getActive() {
    return this.active;
  }

  public getColor() {
    return this.color;
  }

  public rankRemove() {
    if (!this.enabled || this.locked) {
      return;
    }
    if (this.rank > 0) {
      this.rank--;
    }
    this.rankRemoved.emit(this);
    this.changed();
  }

  private clicked() {
    this.rankAdd();
  }

  private dragEnd() {
    this.rankAdd();
  }

  private rightClicked() {
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
