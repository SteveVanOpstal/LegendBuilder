export var TestModule = (function() {
  function TestModule() {}
  TestModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          exports: [BrowserDynamicTestingModule],
          providers: [
            {provide: ActivatedRoute, useValue: new MockActivatedRoute()},
            {provide: Router, useValue: new MockRouter()},

            BaseRequestOptions, {
              provide: Http,
              useFactory: (backend, defaultOptions) => {
                return new Http(backend, defaultOptions);
              },
              deps: [MockBackend, BaseRequestOptions]
            },

            {provide: Event, useValue: new MockEvent()},
            {provide: KeyboardEvent, useValue: new MockKeyboardEvent()}
          ]
        },
      ]
    },
  ];
  /** @nocollapse */
  // TestModule.ctorParameters = [];
  return TestModule;
}());