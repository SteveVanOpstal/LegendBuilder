import {TestBed, inject} from '@angular/core/testing';

import {HelpComponent} from './help.component';

describe('HelpComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [HelpComponent]});
  });

  it('should be initialised', inject([HelpComponent], (component) => {
       expect(component.content).not.toBeDefined();
     }));
});
