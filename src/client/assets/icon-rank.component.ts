import {Component, Input} from '@angular/core';

export class Colors {
  public static blue: string = '#4C99FC';
  public static yellow: string = '#fdf300';
  public static gray: string = '#7e7e7e';
}

@Component({
  selector: 'icon-rank',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" *ngIf="maxRank > 1" class="rank" width="30" height="16" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient cy="10%" fy="0%" id="radialGradient">
          <stop offset="0%" [attr.stop-color]="color"/>
          <stop offset="100%" stop-color="#000"/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="30" height="16"/>
      <rect x="7" y="1" width="16" height="14" opacity="0.7" fill="url(#radialGradient)"/>
      <rect x="1" y="1" width="28" height="14" [attr.stroke]="color" fill="none" stroke-width="1"/>
      <text x="15" y="12" [attr.fill]="color" text-anchor="middle" font-size="12">{{rank + '/' + maxRank}}</text>
    </svg>`
})

export class IconRankComponent {
  @Input() rank: number;
  @Input() maxRank: number;
  @Input() color: string;
}
