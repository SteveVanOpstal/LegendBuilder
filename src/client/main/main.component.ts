import {Component} from '@angular/core';

@Component({
  selector: 'lb-main',
  styleUrls: ['./main.component.scss'],
  template: `
    <button [routerLink]="['build']"><span class="align-center">Start Building</span></button>`
})

export class MainComponent {
}
