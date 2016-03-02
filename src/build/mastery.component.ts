/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Input, Attribute} from 'angular2/core';
import {NgIf, NgClass} from 'angular2/common';

import {DDragonDirective} from 'app/ddragon.directive';

class Colors {
  public static green: string = "#00f300";
  public static yellow: string = "#fdf300";
  public static gray: string = "#7e7e7e";
}

@Component({
  selector: 'mastery',
  directives: [NgIf, NgClass, DDragonDirective],
  template: `
    <div *ngIf="data" [ngClass]="{disabled: disabled}">
      <svg class="rank" width="30" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient cy="10%" fy="0%" id="radialGradient">
            <stop offset="0%" [attr.stop-color]="color"/>
            <stop offset="100%" stop-color="#000"/>
          </radialGradient>
          <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width="30" height="16"/>
        <rect x="7" y="1" width="16" height="14" opacity="0.7" fill="url(#radialGradient)"/>
        <rect x="1" y="1" width="28" height="14" [attr.stroke]="color" fill="none" stroke-width="0.5" style="filter:url(#glow)"/>
        <text x="15" y="12" [attr.fill]="color" text-anchor="middle" font-size="12">{{data.ranks + '/' + rank}}</text>
      </svg>
      <img [attr.alt]="data.name" width="45px" [ddragon]="'mastery/' + data.image.full">
      <div class="description">
        <h2>{{data.name}}</h2>
        <p>{{data.description[0]}}</p>
      </div>
    </div>`
})

export class MasteryComponent {
  @Input() data: Object;
  private rank: number = 0;
  
  private disabled: boolean = true;
  private color: string = Colors.gray;

  constructor(@Attribute('class') classy: string) {
    this.setDisabled();
  }
  
  setDisabled() {
    //this.classy = "disabled";
    this.color = Colors.gray;
    this.disabled = true;
  }
  
  setEnabled() {
    if (!this.data || !this.data['ranks']) {
      this.setDisabled();
      return;
    }
    
    //this.classy = "";
    this.color = this.data['ranks'] == this.rank ? Colors.green : Colors.yellow;
    this.disabled = true;
  }
}