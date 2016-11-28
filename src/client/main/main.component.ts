import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'lb-main',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./main.css').toString()],
  template: `
    <button [routerLink]="['build']"><span class="align-center">Start Building</span></button>`
})

export class MainComponent {
}
