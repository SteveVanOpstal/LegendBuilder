'use strict';
describe('RegionsComponent', () => {

  beforeEach(() => {
    browser.get('/');
  });


  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Legend Builder');
  });

  it('should select EUW', () => {
    browser.driver.getCurrentUrl().then(function(url) {
      expect(/\.*\/euw/.test(url)).toBeFalsy();

      element(by.css('region button[href=\'/euw\']')).click();

      browser.driver.getCurrentUrl().then(function(url) {
        expect(/\.*\/euw/.test(url)).toBeTruthy();
      });
    });
  });

});
