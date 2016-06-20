import {NgClass, NgIf} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import {DDragonDirective} from '../../misc/ddragon.directive';

import {MasteryTierComponent} from './mastery-tier.component';

export class Colors {
  public static blue: string = '#4C99FC';
  public static yellow: string = '#fdf300';
  public static gray: string = '#7e7e7e';
}

@Component({
  selector: 'mastery',
  directives: [NgIf, NgClass, DDragonDirective],
  template: `
    <div *ngIf="data" [ngClass]="{enabled: enabled, active: active}" (click)="clicked()" (contextmenu)="rightClicked()" (dragend)="dragEnd()">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" *ngIf="data.ranks > 1" class="rank" width="30" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient cy="10%" fy="0%" id="radialGradient">
            <stop offset="0%" [attr.stop-color]="color"/>
            <stop offset="100%" stop-color="#000"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="30" height="16"/>
        <rect x="7" y="1" width="16" height="14" opacity="0.7" fill="url(#radialGradient)"/>
        <rect x="1" y="1" width="28" height="14" [attr.stroke]="color" fill="none" stroke-width="1"/>
        <text x="15" y="12" [attr.fill]="color" text-anchor="middle" font-size="12">{{rank + '/' + data.ranks}}</text>
      </svg>
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

  public ngOnChanges() { this.changed(); }

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

  public lock() { this.locked = true; }

  public unlock() { this.locked = false; }

  public getRank() { return this.rank; }

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

  private clicked() { this.rankAdd(); }

  private dragEnd() { this.rankAdd(); }

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
