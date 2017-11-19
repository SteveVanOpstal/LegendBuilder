import {Component} from '@angular/core';
import {pkg} from '../../package';

@Component({
  selector: 'lb-version',
  styleUrls: ['./version.component.scss'],
  template: `
    <a href="https://github.com/SteveVanOpstal/LegendBuilder/releases" class="{{ version }}">
      {{ version }}
    </a>`
})

export class VersionComponent { version = pkg.version; }
