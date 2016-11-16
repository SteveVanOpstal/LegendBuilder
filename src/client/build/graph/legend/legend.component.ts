import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import {Path} from '../graph.component';

@Component({
  selector: 'lb-legend',
  template: `
    <ul (mouseleave)="mouseLeave()">
      <li *ngFor="let path of paths">
        <button [ngClass]="{enabled: path.enabled}" [attr.name]="path.name" type="button"
          (mouseenter)="mouseEnter(path)"
          (mouseleave)="mouseLeave(path)"
          (mousedown)="mouseDown(path)"
          (mouseup)="dragging=false">
          {{ path.name }}
        </button>
      </li>
    </ul>`
})

export class LegendComponent implements OnChanges {
  @Input() private paths = new Array<Path>();
  private dragging: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    for (let currentPath of changes['paths'].currentValue) {
      let foundPaths = changes['paths'].previousValue.filter((path: Path) => {
        return path.name === currentPath.name;
      });

      if (foundPaths.length === 1) {
        let previousPath: Path = foundPaths[0];
        currentPath.enabled = previousPath.enabled;
      }
    }
  }

  mouseEnter(path: Path) {
    path.preview = true;
    if (this.dragging) {
      path.enabled = !path.enabled;
    }
  }

  mouseLeave(path: Path|undefined) {
    if (!path) {
      this.dragging = false;
      for (let p of this.paths) {
        p.preview = false;
      }
    } else {
      path.preview = false;
    }
  }

  mouseDown(path: Path) {
    path.enabled = !path.enabled;
    this.dragging = true;
  }
}
