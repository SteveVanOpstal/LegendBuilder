/**
  @license
  Copyright 2015-2016 Steve Van Opstal https://github.com/SteveVanOpstal

  Legend Builder - An advanced League Of Legends champion builder

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along
  with this program; if not, write to the Free Software Foundation, Inc.,
  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

 */

/// <reference path="typings/angular2/angular2.d.ts" />

import {bootstrap} from 'angular2/platform/browser'
import {HTTP_BINDINGS} from 'angular2/http';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {provide} from 'angular2/core';

import {AppComponent} from 'app/app.component'

bootstrap(AppComponent, [
  HTTP_BINDINGS,
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' })
]);