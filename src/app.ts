/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap, provide} from 'angular2/angular2';
import {HTTP_BINDINGS} from 'angular2/http';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, APP_BASE_HREF, RouteConfig} from 'angular2/router';

import {FiltersComponent} from 'choose/filters';
import {ChampionsComponent} from 'choose/champions';

import {ChooseComponent} from 'choose';
import {BuildComponent} from 'build';

@Component({
  selector: 'app'
})
@View({
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '/', component: ChooseComponent, as: 'Choose'},
  { path: '/build', component: BuildComponent, as: 'Build' }
])

class AppComponent {
}

bootstrap(AppComponent, [
  HTTP_BINDINGS,
  FiltersComponent,
  ChampionsComponent,
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, {useValue: '/'})
]);