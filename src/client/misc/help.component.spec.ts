import {beforeEachProviders, inject, it} from '@angular/core/testing';

import {HelpComponent} from './help.component';


describe('HelpComponent', () => {
  beforeEachProviders(() => [HelpComponent]);


  it('should be initialised', inject([HelpComponent], (component) => { expect(component.content).not.toBeDefined(); }));
});
