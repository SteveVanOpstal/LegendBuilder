import {Component, ViewEncapsulation} from '@angular/core';

import {AuthService} from '../services/auth.service';

@Component({
  selector: 'lb-login',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./login.css').toString()],
  template: `
    <div class="align-center">
      <div class="email">
        <label for="name">Email</label>
        <input type="text" class="form-control" #email placeholder="yours@example.com" autofocus>
      </div>
      <div class="password">
        <label for="name">Password</label>
        <input type="password" class="form-control" #password placeholder="your password">
      </div>
      <div class="actions">
        <div class="align-center">
          <button type="submit" (click)="auth.login(email.value, password.value)">Login</button>
        </div>
      </div>
      <div class="auth0-badge">
        <a class="align-center" href="https://auth0.com/">
          <img width="200"
              height="66.6"
              alt="JWT Auth for open source projects"
              src="//cdn.auth0.com/oss/badges/a0-badge-light.png">
        </a>
      </div>
      <lb-error [error]="auth.error()" [message]="auth.error().message"></lb-error>
    </div>`
})

export class LoginComponent {
  constructor(auth: AuthService) {}
}
