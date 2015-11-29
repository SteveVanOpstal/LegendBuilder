/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap, provide} from 'angular2/angular2';
import {HTTP_BINDINGS} from 'angular2/http';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, APP_BASE_HREF, RouteConfig} from 'angular2/router';

import {ChooseComponent} from 'choose';
import {BuildComponent} from 'build';

import {FiltersComponent} from 'choose/filters';
import {ChampionsComponent} from 'choose/champions';

import {ShopComponent} from 'build/shop';
import {AbilitiesComponent} from 'build/abilities'

@Component({
  selector: 'app'
})
@View({
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '/', component: ChooseComponent, as: 'Choose'},
  { path: '/build/:champion', component: BuildComponent, as: 'Build' }
])

class AppComponent {
}

bootstrap(AppComponent, [
  HTTP_BINDINGS,
  
  FiltersComponent,
  ChampionsComponent,
  
  ShopComponent,
  
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, {useValue: '/'})
]);