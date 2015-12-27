/// <reference path="typings/angular2/angular2.d.ts" />

import {bootstrap} from 'angular2/platform/browser'
import {HTTP_BINDINGS} from 'angular2/http';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {provide} from 'angular2/core';

import {AppComponent} from 'app/app.component'

bootstrap(AppComponent, [
  HTTP_BINDINGS,
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, {useValue: '/'})
]);