import {Component, Input} from '@angular/core';

@Component({
  selector: 'lb-rank',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="rank" width="30" height="16">
      <rect x="0" y="0" width="30" height="16" fill="#0D141C"/>
      <rect x="0" y="0" width="30" height="16" stroke="#868691" stroke-width="2"/>
      <text x="15" y="12" fill="#938F82" text-anchor="middle" font-size="12">
        {{ rank + '/' + maxRank }}
      </text>
    </svg>`
})

export class RankComponent {
  @Input() rank: number;
  @Input() maxRank: number;
}
