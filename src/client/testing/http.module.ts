import {NgModule} from '@angular/core';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {MockMockBackend} from './';

@NgModule({
  providers: [
    {provide: MockBackend, useValue: new MockMockBackend()},

    BaseRequestOptions, {
      provide: Http,
      useFactory: (backend, defaultOptions) => {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }
  ]
})
export class HttpModule {}
