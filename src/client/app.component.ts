import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from './services/auth.service';

@Component({selector: 'app', providers: [AuthService], template: '<router-outlet></router-outlet>'})

export class AppComponent {
  constructor(private router: Router) {}
}
