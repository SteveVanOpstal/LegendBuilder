import {Component} from '@angular/core';

@Component({
  selector: 'lb-main',
  styleUrls: ['./main.component.scss'],
  template: `
  <div class="content">
    <div class="align-center">
      <div class="align-center">
        <h2>Welcome</h2>
        <button [routerLink]="['build']"><span class="align-center">Start Building</span></button>
      </div>
    </div>
  </div>`
})

export class MainComponent {
}
