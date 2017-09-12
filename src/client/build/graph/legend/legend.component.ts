import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import {Line} from '../line.component';

@Component({
  selector: 'lb-legend',
  styleUrls: ['./legend.component.scss'],
  template: `
    <ul (mouseleave)="mouseLeave()">
      <li *ngFor="let line of lines">
        <button [ngClass]="{enabled: line.enabled}" [attr.name]="line.name" type="button"
          (mouseenter)="mouseEnter(line)"
          (mouseleave)="mouseLeave(line)"
          (mousedown)="mouseDown(line)"
          (mouseup)="dragging=false">
          {{ line.name }}
        </button>
        <p>{{ line.currentValue }}</p>
      </li>
    </ul>`
})

export class LegendComponent implements OnChanges {
  @Input() lines = new Array<Line>();
  dragging = false;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['lines'] || !changes['lines'].previousValue) {
      return;
    }
    for (const currentLine of changes['lines'].currentValue) {
      const foundLines = changes['lines'].previousValue.filter((line: Line) => {
        return line.name === currentLine.name;
      });

      if (foundLines.length === 1) {
        const previousLine: Line = foundLines[0];
        currentLine.enabled = previousLine.enabled;
      }
    }
  }

  mouseEnter(line: Line) {
    line.preview = true;
    if (this.dragging) {
      line.enabled = !line.enabled;
    }
  }

  mouseLeave(line?: Line) {
    if (!line) {
      this.dragging = false;
      for (const p of this.lines) {
        p.preview = false;
      }
    } else {
      line.preview = false;
    }
  }

  mouseDown(line: Line) {
    line.enabled = !line.enabled;
    this.dragging = true;
  }
}
