import {NgModule} from '@angular/core';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../services/lolapi.service';

import {MockActivatedRoute, MockEvent, MockKeyboardEvent, MockMockBackend, MockRouter} from './';

@NgModule({
  providers: [
    {provide: ActivatedRoute, useValue: new MockActivatedRoute()},
    {provide: MockBackend, useValue: new MockMockBackend()},
    {provide: Router, useValue: new MockRouter()},

    BaseRequestOptions, {
      provide: Http,
      useFactory: (backend, defaultOptions) => {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    },

    {provide: Event, useValue: new MockEvent()},
    {provide: KeyboardEvent, useValue: new MockKeyboardEvent()},

    LolApiService
  ]
})
export class TestModule {
}
