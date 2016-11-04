import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AuthService} from './services/auth.service';

@Component({
  selector: 'actions',
  template: `
    <button [routerLink]="['login']" *ngIf="active()">
      <span class="align-center">Login</span>
    </button>
    <button [routerLink]="['signup']" *ngIf="active()">
      <span class="align-center">Sign up</span>
    </button>`
})

export class ActionsComponent {
  private authPage: boolean = false;

  constructor(private route: ActivatedRoute, private auth: AuthService) {
    this.route.url.subscribe((r) => {
      this.authPage = r[0].path === 'login' || r[0].path === 'signup';
    });
  }

  active() {
    return !this.auth.authenticated() && !this.authPage;
  }
}
