'use strict';
describe('RegionsComponent', () => {

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Legend Builder');
  });

  it('should select EUW', () => {
    element(by.css('region button[href="/euw"]')).click();
    browser.driver.getCurrentUrl().then((url) => {
      expect(/\.*\/euw/.test(url)).toBeTruthy();
    });
  });

});
