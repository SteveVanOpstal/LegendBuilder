import 'rxjs/add/operator/takeuntil';

import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {select} from 'd3-selection';

import {ReactiveComponent} from '../../shared/reactive.component';
import {tim} from '../../shared/tim';
import {BuildSandbox} from '../build.sandbox';
import {LevelAxisLine, LevelAxisText} from '../graph/axes';
import {LevelScale} from '../graph/scales';
import {Samples} from '../samples';

@Component({
  selector: 'lb-abilities',
  styleUrls: ['./abilities.component.scss'],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 220" width="100%" height="100%">
      <g [ngClass]="{ult : i == 3}" *ngFor="let spell of champion?.spells; let i = index">
        <g fill="gray">
          <rect x="10" [attr.y]="5 + (i * 50) + (i == 3 ? 5 : 0)" width="100%" height="30">
          </rect>
        </g>
        <image [id]="spell.image.full"
               [attr.href]="'spell/' + spell.image.full | lbDDragon"
               [attr.x]="i == 3 ? 0 : 5"
               [attr.y]="(i * 50)"
               [attr.height]="i == 3 ? 50 : 40"
               [attr.width]="i == 3 ? 50 : 40">
          <title [innerHTML]="spell.extendedTooltip"></title>
        </image>
      </g>
      <g transform="translate(60,0)">
        <g class="x axis level-line"></g>
        <g class="x axis level-text"></g>
      </g>
    </svg>`
})

export class AbilitiesComponent extends ReactiveComponent implements OnInit {
  champion: any;

  private svg: any;

  private xScaleLevel = new LevelScale([0, 1420]);
  private xAxisLevelLine = new LevelAxisLine(200);
  private xAxisLevelText = new LevelAxisText(200);

  constructor(@Inject(ElementRef) private elementRef: ElementRef, private sb: BuildSandbox) {
    super();
  }

  ngOnInit() {
    this.svg = select(this.elementRef.nativeElement).select('svg');
    this.sb.champion$.takeUntil(this.takeUntilDestroyed$).subscribe((champion) => {
      this.champion = champion;
      this.update();
    });

    this.sb.matchdata$.takeUntil(this.takeUntilDestroyed$)
        .subscribe(samples => this.createLevelScale(samples));
  }

  private update(): void {
    for (const spell of this.champion.spells) {
      spell.extendedTooltip = this.applyEffects(spell);
    }
  }

  private applyEffects(spell: any) {
    const effects = new Object();

    if (spell.effect) {
      for (let i = 0; i < spell.effect.length; i++) {
        const value = spell.effect[i];
        if (value) {
          effects['e' + i] = value[0];
        }
      }
    }

    if (spell.vars) {
      for (const value of spell.vars) {
        if (value.key && value.coeff) {
          effects[value.key] = value.coeff[0];
        }
      }
    }

    const stats = this.getStats();
    for (const attrname of Object.keys(stats)) {
      effects[attrname] = stats[attrname];
    }

    return tim(spell.tooltip, effects);
  }

  private getStats(): Array<string> {
    const stats = [];
    let i = 0;
    for (const stat of Object.keys(this.champion.stats)) {
      i++;
      stats['f' + i] = this.champion.stats[stat];
    }
    return stats;
  }

  private createLevelScale(samples: Samples) {
    if (!samples || !samples.xp || !samples.xp.length) {
      return;
    }

    this.xScaleLevel.create();
    this.xScaleLevel.update(samples);

    this.xAxisLevelLine.create(this.xScaleLevel);
    this.xAxisLevelText.create(this.xScaleLevel);

    this.xAxisLevelText.update(samples);

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
