/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Input, Inject, forwardRef, OnInit} from 'angular2/core';
import {NgIf, NgClass} from 'angular2/common';

import {DDragonDirective} from 'app/ddragon.directive';
import {MasteryTierComponent} from 'app/mastery-tier.component';

class Colors {
  public static blue: string = "#4C99FC";
  public static yellow: string = "#fdf300";
  public static gray: string = "#7e7e7e";
}

@Component({
  selector: 'mastery',
  directives: [NgIf, NgClass, DDragonDirective],
  template: `
    <div *ngIf="data" [ngClass]="{disabled: disabled, active: active}" (click)="clicked()" (contextmenu)="rightClicked()">
      <svg *ngIf="data.ranks > 1" class="rank" width="30" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg">
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
      <img [attr.alt]="data.name" height="45px" width="45px" [ddragon]="'mastery/' + data.image.full">
      <div class="description">
        <h2>{{data.name}}</h2>
        <p>{{data.description[0]}}</p>
      </div>
    </div>`
})

export class MasteryComponent implements OnInit {
  @Input() data: Object;
  
  public rank: number = 0;
  private color: string = Colors.gray;
  
  private disabled: boolean = true;
  private active: boolean = false;
  private locked: boolean = false;

  constructor(@Inject(forwardRef(() => MasteryTierComponent)) private tier: MasteryTierComponent) {
  }
  
  public ngOnInit() {
    this.tier.addMastery(this);
  }
  
  private changed() {
    if (this.disabled) {
      this.active = false;
    } else {
      this.active = this.rank != 0;
    }
    
    if (this.disabled && !this.active) {
      this.color = Colors.gray;
      return;
    }
    this.color = this.active ? Colors.yellow : Colors.blue;
  }
  
  public disable() {
    if(this.disabled) {
      return;
    }
    this.color = Colors.gray;
    this.disabled = true;
    this.changed();
  }
  
  public enable() {
    if(!this.disabled) {
      return;
    }
    if (!this.data) {
      this.disable();
      return;
    }
    this.disabled = false;
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
  
  public setRank(rank: number) {
    if(this.disabled) {
      return;
    }
    this.rank = rank;
    this.changed();
  }
  
  private getMaxRank() {
    if (!this.data || !this.data['ranks']){
      return 0;
    }
    return this.data['ranks'];
  }
  
  private clicked() {
    this.addRank();
  }
  
  private rightClicked() {
    this.removeRank();
    return false; // stop context menu from appearing
  }
  
  private addRank() {
    if(this.disabled) {
      return;
    }
    if (this.rank < this.getMaxRank()) {
      this.rank++;
    }
    this.changed();
    this.tier.addRank(this);
  }
  
  private removeRank() {
    if(this.disabled || this.locked) {
      return;
    }
    if(this.rank > 0) {
      this.rank--;
    }
    this.changed();
    this.tier.removeRank(this);
  }
}