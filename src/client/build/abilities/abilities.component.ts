import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {select} from 'd3-selection';

import {BuildService} from '../../services/build.service';
import {tim} from '../../shared/tim';
import {LevelAxisLine, LevelAxisText} from '../graph/axes';
import {LevelScale} from '../graph/scales';
import {Samples} from '../samples';

@Component({
  selector: 'abilities',
  template: `
    <!--<div>
      <img *ngFor="let spell of champion?.spells; let i = index" [id]="spell.image.full" class="ability" [ngClass]="{ult : i == 3}"
        [title]="getExtendedTooltip(i)" [ddragon]="'spell/' + spell.image.full"/>
    </div>-->
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 1500 220" width="100%" height="100%">
      <g [ngClass]="{ult : i == 3}" *ngFor="let spell of champion?.spells; let i = index">
        <image [id]="spell.image.full" [ddragon]="'spell/' + spell.image.full" [attr.x]="i == 3 ? 0 : 5" [attr.y]="(i * 50)" [attr.height]="i == 3 ? 50 : 40" [attr.width]="i == 3 ? 50 : 40">
          <title>{{getExtendedTooltip(i)}}</title>
        </image>
        <g fill="gray">
          <rect x="10" [attr.y]="5 + (i * 50) + (i == 3 ? 5 : 0)" [attr.width]="width" height="30"></rect>
        </g>
      </g>
      <g transform="translate(60,0)">
        <g class="x axis level-line"></g>
        <g class="x axis level-text"></g>
      </g>
    </svg>`
})

export class AbilitiesComponent implements OnInit {
  private svg: any;

  private samples: Samples;
  private champion: any;

  private xScaleLevel = new LevelScale([0, 1380]);
  private xAxisLevelLine = new LevelAxisLine(200);
  private xAxisLevelText = new LevelAxisText(200);

  constructor(@Inject(ElementRef) private elementRef: ElementRef, private build: BuildService) {}

  ngOnInit() {
    this.svg = select(this.elementRef.nativeElement).select('svg');
    this.build.champion.subscribe((champion) => {
      this.champion = champion;
    });
    this.build.samples.subscribe((samples: Samples) => {
      this.samples = samples;
      this.createLevelScale();
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

  private createLevelScale() {
    if (!this.samples.xp.length) {
      return;
    }

    this.xScaleLevel.create();
    this.xScaleLevel.update(this.samples);

    this.xAxisLevelLine.create(this.xScaleLevel);
    this.xAxisLevelText.create(this.xScaleLevel);

    this.xAxisLevelText.update(this.samples);

    this.svg.select('.x.axis.level-line').call(this.xAxisLevelLine.get());
    this.svg.select('.x.axis.level-text').call(this.xAxisLevelText.get());

    for (let i = 1; i <= 4; i++) {
      this.svg.selectAll('.x.axis.level-text .tick')
          .append('foreignObject')
          .attr('y', 10 + ((i - 1) * 50) + (i > 3 ? 5 : 0))
          .attr('x', -10)
          .append('xhtml:label')
          .append('xhtml:input')
          .attr('type', 'checkbox');
    }
  }
}
