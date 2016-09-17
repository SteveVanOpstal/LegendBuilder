import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {tokenNotExpired} from 'angular2-jwt';
import * as Auth0 from 'auth0-js';

const cid = '0rrx82d4Hhzi63p7MCfK4wuJkRnVcOYB';
const domain = 'legendbuilder.eu.auth0.com';

@Injectable()
export class AuthService {
  private _error: any = false;

  // Configure Auth0
  private auth0 = new Auth0(
      {clientID: cid, domain: domain, callbackOnLocationHash: true, callbackURL: '/account'});

  constructor(private router: Router) {
    let result = this.auth0.parseHash(window.location.hash);

    if (result && result.id_token) {
      localStorage.setItem('id_token', result.id_token);
      this.router.navigate(['/home']);
    } else if (result && result.state) {
      this._error = result.state;
    }
  }

  public signUp(email, password) {
    let current = this;
    this.auth0.signup(
        {
          auto_login: true,
          connection: 'Username-Password-Authentication',
          email: email,
          password: password
        },
        function(err) {
          current._error = err;
          // if (!err) {
          //   current.router.navigate(['account']);
          // }
        });
  }

  public login(email, password) {
    let current = this;
    this.auth0.login(
        {
          connection: 'Username-Password-Authentication',
          responseType: 'token',
          email: email,
          password: password
        },
        function(err) {
          current._error = err;
          // if (!err) {
          //   current.router.navigate(['account']);
          // }
        });
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
  }

  // // Configure Auth0
  // lock = new Auth0Lock(cid, domain);

  // constructor() {
  //   // Add callback for lock `authenticated` event
  //   this.lock.on('authenticated', (authResult) => {
  //     localStorage.setItem('id_token', authResult.idToken);
  //   });
  // }

  // public login() {
  //   // Call the show method to display the widget.
  //   this.lock.show();
  // }

  public authenticated() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public error() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return this._error;
  }

  // public known() {
  //   // Check if the user has an account
  //   return this.cookieService.get('auth.known') === 'true';
  // }
}
