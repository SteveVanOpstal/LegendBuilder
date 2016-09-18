import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../services/auth.service';

@Component({
  selector: 'main',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./main.css').toString()],
  template: `
    <button [routerLink]="['build']"><span class="align-center">Start Building</span></button>`
})

export class MainComponent {
  constructor(private router: Router, private auth: AuthService) {}
}
