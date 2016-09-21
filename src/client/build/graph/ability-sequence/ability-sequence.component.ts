import {Component, OnInit} from '@angular/core';

import {tim} from '../../../shared/tim';
import {BuildService} from '../../services/build.service';

@Component({
  selector: 'g[ability-sequence]',
  template: `
    <svg:g xmlns="http://www.w3.org/2000/svg" version="1.1" class="ability" [ngClass]="{ult : i == 3}" *ngFor="let spell of champion?.spells; let i = index">
      <g fill="gray">
        <rect x="10" [attr.y]="5 + (i * 50) + (i == 3 ? 5 : 0)" [attr.width]="width" height="30"></rect>
      </g>
      <image [id]="spell.image.full" [ddragon]="'spell/' + spell.image.full" [attr.x]="i == 3 ? 0 : 5" [attr.y]="(i * 50)" [attr.height]="i == 3 ? 50 : 40" [attr.width]="i == 3 ? 50 : 40">
        <title>{{getExtendedTooltip(i)}}</title>
      </image>
    </svg:g>`
})

export class AbilitySequenceComponent implements OnInit {
  private champion: any;

  constructor(private build: BuildService) {}

  ngOnInit() {
    this.build.champion.subscribe((champion) => {
      this.champion = champion;
    });
  }

  getExtendedTooltip(index: number): string {
    let spell = this.champion.spells[index];
    return this.applyEffects(spell);
  }

  private applyEffects(spell: any) {
    let effects = new Object();

    if (spell.effect) {
      for (let i = 0; i < spell.effect.length; i++) {
        let value = spell.effect[i];
        if (value) {
          effects['e' + i] = value[0];
        }
      }
    }

    if (spell.vars) {
      for (let value of spell.vars) {
        if (value.key && value.coeff) {
          effects[value.key] = value.coeff[0];
        }
      }
    }

    let stats = this.getStats();
    for (let attrname in stats) {
      effects[attrname] = stats[attrname];
    }

    return tim(spell.sanitizedTooltip, effects);
  }

  private getStats(): Array<string> {
    let stats = [];
    let i = 0;
    for (let stat in this.champion.stats) {
      i++;
      stats['f' + i] = this.champion.stats[stat];
    }
    return stats;
  }
}
