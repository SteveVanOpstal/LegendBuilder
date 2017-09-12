import {Component} from '@angular/core';

@Component({
  selector: 'lb-version',
  styleUrls: ['./version.component.scss'],
  template: `
    <a href="https://github.com/SteveVanOpstal/LegendBuilder/releases" class="{{ pkg.version }}">
      {{ pkg.version }}
    </a>`
})

export class VersionComponent {
  pkg = require('../../package.json');
}
