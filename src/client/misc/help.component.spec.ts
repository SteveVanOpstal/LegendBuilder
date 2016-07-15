import {addProviders, inject} from '@angular/core/testing';

import {HelpComponent} from './help.component';

describe('HelpComponent', () => {
  beforeEach(() => {
    addProviders([HelpComponent]);
  });

  it('should be initialised', inject([HelpComponent], (component) => {
       expect(component.content).not.toBeDefined();
     }));
});
